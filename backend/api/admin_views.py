import json
import os
import subprocess
from datetime import datetime
from pathlib import Path

from django.conf import settings
from django.db import IntegrityError
from django.db.models import Count, Sum
from django.http import FileResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from api.models import AuditLog, Category, Transaction, User
from api.utils import admin_required


def parse_json(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except Exception:
        return {}


def write_audit(actor, action, target_type='', target_id='', details=''):
    AuditLog.objects.create(
        actor_id=actor.id,
        action=action,
        target_type=target_type,
        target_id=str(target_id),
        details=details,
    )


def user_summary(user):
    last_activity = user.transactions.order_by('-created_at').values_list('created_at', flat=True).first()
    return {
        'id': user.id,
        'full_name': user.full_name,
        'email': user.email,
        'is_active': user.is_active,
        'is_admin': user.is_admin,
        'created_at': user.created_at.isoformat() if user.created_at else None,
        'transaction_count': user.transactions.count(),
        'last_activity': last_activity.isoformat() if last_activity else None,
    }


@admin_required
def admin_overview(request):
    if request.method != 'GET':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    transactions = Transaction.objects.all()
    totals = transactions.aggregate(income=Sum('amount'), count=Count('id'))
    income = transactions.filter(type='Income').aggregate(total=Sum('amount'))['total'] or 0
    expenses = transactions.filter(type='Expense').aggregate(total=Sum('amount'))['total'] or 0
    return JsonResponse({
        'stats': {
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'inactive_users': User.objects.filter(is_active=False).count(),
            'total_categories': Category.objects.count(),
            'total_transactions': totals['count'] or 0,
            'total_income': float(income),
            'total_expenses': float(expenses),
        },
        'recent_activity': [tx.to_dict() for tx in transactions.select_related('category').order_by('-created_at')[:10]],
        'audit_logs': [log.to_dict() for log in AuditLog.objects.order_by('-created_at')[:10]],
    })


@csrf_exempt
@admin_required
def admin_users(request):
    if request.method == 'GET':
        return JsonResponse([user_summary(user) for user in User.objects.order_by('-created_at')], safe=False)
    return JsonResponse({'message': 'Method not allowed.'}, status=405)


@csrf_exempt
@admin_required
def admin_user_status(request, user_id):
    if request.method != 'PUT':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    user = User.objects.filter(id=user_id).first()
    if not user:
        return JsonResponse({'message': 'User not found.'}, status=404)
    if user.id == request.user_obj.id:
        return JsonResponse({'message': 'You cannot deactivate your own account.'}, status=400)

    data = parse_json(request)
    if 'is_active' not in data or not isinstance(data['is_active'], bool):
        return JsonResponse({'message': 'is_active must be a boolean.'}, status=400)

    user.is_active = data['is_active']
    user.save(update_fields=['is_active'])
    action = 'activated_user' if user.is_active else 'deactivated_user'
    write_audit(request.user_obj, action, 'User', user.id, user.email)
    return JsonResponse(user_summary(user))


@csrf_exempt
@admin_required
def admin_categories(request):
    if request.method == 'GET':
        categories = Category.objects.select_related('user').order_by('type', 'category_name')
        return JsonResponse([
            {
                **category.to_dict(),
                'owner_name': category.user.full_name if category.user else 'System',
            }
            for category in categories
        ], safe=False)

    if request.method == 'POST':
        data = parse_json(request)
        name = str(data.get('category_name', '')).strip()
        category_type = data.get('type')
        if not name or category_type not in ['Income', 'Expense']:
            return JsonResponse({'message': 'Category name and valid type are required.'}, status=400)
        if Category.objects.filter(user__isnull=True, category_name__iexact=name, type=category_type).exists():
            return JsonResponse({'message': 'System category already exists.'}, status=400)
        category = Category.objects.create(category_name=name, type=category_type)
        write_audit(request.user_obj, 'created_category', 'Category', category.id, name)
        return JsonResponse(category.to_dict(), status=201)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


@csrf_exempt
@admin_required
def admin_category_detail(request, category_id):
    category = Category.objects.filter(id=category_id).first()
    if not category:
        return JsonResponse({'message': 'Category not found.'}, status=404)

    if request.method == 'PUT':
        data = parse_json(request)
        name = str(data.get('category_name', '')).strip()
        if not name:
            return JsonResponse({'message': 'Category name is required.'}, status=400)
        category.category_name = name
        category.save(update_fields=['category_name'])
        write_audit(request.user_obj, 'renamed_category', 'Category', category.id, name)
        return JsonResponse(category.to_dict())

    if request.method == 'DELETE':
        try:
            category.delete()
        except IntegrityError:
            return JsonResponse({'message': 'Category cannot be deleted while transactions use it.'}, status=400)
        write_audit(request.user_obj, 'deleted_category', 'Category', category.id, category.category_name)
        return JsonResponse({'message': 'Category deleted successfully.'})

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


@admin_required
def admin_reports(request):
    if request.method != 'GET':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    rows = []
    for user in User.objects.order_by('full_name'):
        income = Transaction.objects.filter(user=user, type='Income').aggregate(total=Sum('amount'))['total'] or 0
        expenses = Transaction.objects.filter(user=user, type='Expense').aggregate(total=Sum('amount'))['total'] or 0
        rows.append({
            'user_id': user.id,
            'user_name': user.full_name,
            'email': user.email,
            'income': float(income),
            'expenses': float(expenses),
            'balance': float(income - expenses),
        })

    category_totals = Transaction.objects.filter(type='Expense').values('category__category_name').annotate(total=Sum('amount')).order_by('-total')
    return JsonResponse({
        'by_user': rows,
        'by_category': [
            {'category_name': row['category__category_name'], 'total': float(row['total'] or 0)}
            for row in category_totals
        ],
    })


@admin_required
def admin_audit_logs(request):
    if request.method != 'GET':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)
    logs = AuditLog.objects.order_by('-created_at')[:200]
    return JsonResponse([log.to_dict() for log in logs], safe=False)


@admin_required
def admin_backup(request):
    if request.method != 'GET':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    database_config = settings.DATABASES['default']
    database_engine = database_config.get('ENGINE', '')
    database_name = database_config.get('NAME')
    database_path = Path(database_name) if database_name else None

    if 'sqlite' not in database_engine and 'mysql' in database_engine:
        command = [
            'mysqldump',
            '--host', str(database_config.get('HOST') or 'localhost'),
            '--port', str(database_config.get('PORT') or 3306),
            '--user', str(database_config.get('USER') or ''),
            '--single-transaction',
            '--routines',
            str(database_name),
        ]
        environment = os.environ.copy()
        environment['MYSQL_PWD'] = str(database_config.get('PASSWORD') or '')
        try:
            result = subprocess.run(command, capture_output=True, env=environment, check=False)
        except FileNotFoundError:
            return JsonResponse({'message': 'mysqldump is not installed on the server.'}, status=501)
        if result.returncode != 0:
            return JsonResponse({'message': result.stderr.decode('utf-8', errors='replace')}, status=500)
        write_audit(request.user_obj, 'downloaded_database_backup', 'Database', '', str(database_name))
        response = HttpResponse(result.stdout, content_type='application/sql')
        response['Content-Disposition'] = f'attachment; filename="expense_tracker_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.sql"'
        return response

    if not database_path or not database_path.is_file():
        return JsonResponse({'message': 'The configured database file could not be found.'}, status=404)

    write_audit(request.user_obj, 'downloaded_database_backup', 'Database', '', database_path.name)
    filename = f'expense_tracker_backup_{datetime.now().strftime("%Y%m%d_%H%M%S")}.sqlite3'
    return FileResponse(database_path.open('rb'), as_attachment=True, filename=filename)
