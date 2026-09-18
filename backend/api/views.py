import json
import random
import io
import csv
from datetime import datetime, timedelta
from django.utils import timezone
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum, Q, F
from django.core.mail import send_mail
from django.conf import settings

from api.models import User, Category, Transaction, Settings, Budget, RecurringExpense, SavingsGoal, Notification, AuditLog
from api.seed import seed_user_defaults
from api.utils import create_access_token, jwt_required

def parse_json(request):
    try:
        return json.loads(request.body.decode('utf-8'))
    except Exception:
        return {}


# ----------------------- AUTH VIEWS -----------------------

@csrf_exempt
def register(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)
    
    data = parse_json(request)
    full_name = data.get('full_name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    confirm_password = data.get('confirm_password', '')

    if not full_name or not email or not password:
        return JsonResponse({'message': 'All fields are required.'}, status=400)
        
    if password != confirm_password:
        return JsonResponse({'message': 'Passwords do not match.'}, status=400)
        
    if len(password) < 6:
        return JsonResponse({'message': 'Password must be at least 6 characters.'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'message': 'Email address is already registered.'}, status=400)

    user = User(full_name=full_name, email=email)
    user.set_password(password)
    user.save()

    seed_user_defaults(user.id)

    access_token = create_access_token(user.id)
    return JsonResponse({
        'message': 'Registration successful.',
        'access_token': access_token,
        'user': user.to_dict()
    }, status=201)


@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)
    
    data = parse_json(request)
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return JsonResponse({'message': 'Email and password are required.'}, status=400)

    user = User.objects.filter(email=email).first()
    if not user or not user.is_active or not user.check_password(password):
        return JsonResponse({'message': 'Invalid email or password.'}, status=401)

    access_token = create_access_token(user.id)
    return JsonResponse({
        'message': 'Login successful.',
        'access_token': access_token,
        'user': user.to_dict()
    }, status=200)


@csrf_exempt
def send_otp(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    data = parse_json(request)
    email = data.get('email', '').strip().lower()

    if not email:
        return JsonResponse({'message': 'Email address is required.'}, status=400)

    user = User.objects.filter(email=email).first()
    if not user:
        return JsonResponse({'message': 'No account found with this email.'}, status=404)

    otp = str(random.randint(100000, 999999))
    user.otp = otp
    user.otp_expiry = timezone.now() + timedelta(minutes=10)
    user.save()

    try:
        send_mail(
            subject="Your Expense Tracker OTP Code",
            message=f"Hello {user.full_name},\n\nYour OTP code to change your password is: {otp}\n\nThis code will expire in 10 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return JsonResponse({'message': f'OTP sent to {email}. Please check your inbox!'}, status=200)
    except Exception as e:
        return JsonResponse({'message': f'Failed to send email via SMTP ({e}).'}, status=500)


@csrf_exempt
def reset_password_otp(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    data = parse_json(request)
    email = data.get('email', '').strip().lower()
    otp = data.get('otp', '').strip()
    new_password = data.get('new_password', '')

    if not email or not otp or not new_password:
        return JsonResponse({'message': 'Email, OTP, and new password are required.'}, status=400)

    if len(new_password) < 6:
        return JsonResponse({'message': 'Password must be at least 6 characters.'}, status=400)

    user = User.objects.filter(email=email).first()
    if not user:
        return JsonResponse({'message': 'User not found.'}, status=404)

    if not user.otp or user.otp != otp:
        return JsonResponse({'message': 'Invalid OTP code.'}, status=400)

    if user.otp_expiry and timezone.now() > user.otp_expiry:
        return JsonResponse({'message': 'OTP has expired. Please request a new one.'}, status=400)

    user.set_password(new_password)
    user.otp = None
    user.otp_expiry = None
    user.save()

    return JsonResponse({'message': 'Password changed successfully! You can now log in.'}, status=200)


# ----------------------- PROFILE VIEWS -----------------------

@csrf_exempt
@jwt_required
def profile_view(request):
    user = request.user_obj
    if request.method == 'GET':
        return JsonResponse(user.to_dict(), status=200)

    elif request.method == 'PUT':
        data = parse_json(request)
        full_name = data.get('full_name', '').strip()
        email = data.get('email', '').strip().lower()
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')

        if full_name:
            user.full_name = full_name

        if email and email != user.email:
            if User.objects.filter(email=email).exclude(id=user.id).exists():
                return JsonResponse({'message': 'Email address is already in use.'}, status=400)
            user.email = email

        if new_password:
            if not current_password:
                return JsonResponse({'message': 'Current password is required to change password.'}, status=400)
            if not user.check_password(current_password):
                return JsonResponse({'message': 'Incorrect current password.'}, status=400)
            if len(new_password) < 6:
                return JsonResponse({'message': 'New password must be at least 6 characters.'}, status=400)
            user.set_password(new_password)

        user.save()
        return JsonResponse({'message': 'Profile updated successfully.', 'user': user.to_dict()}, status=200)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


# ----------------------- TRANSACTIONS VIEWS -----------------------

@csrf_exempt
@jwt_required
def transactions_list_create(request):
    user = request.user_obj

    if request.method == 'GET':
        search = request.GET.get('search', '').strip()
        category_id = request.GET.get('category_id')
        tx_type = request.GET.get('type')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        sort_by = request.GET.get('sort_by', 'newest')
        try:
            page = int(request.GET.get('page', 1))
        except ValueError:
            page = 1
        try:
            per_page = int(request.GET.get('per_page', 10))
        except ValueError:
            per_page = 10

        query = Transaction.objects.filter(user=user)

        if search:
            query = query.filter(description__icontains=search)
        if category_id:
            query = query.filter(category_id=category_id)
        if tx_type in ['Income', 'Expense']:
            query = query.filter(type=tx_type)

        if start_date:
            try:
                d = datetime.strptime(start_date, '%Y-%m-%d').date()
                query = query.filter(transaction_date__gte=d)
            except ValueError:
                pass

        if end_date:
            try:
                d = datetime.strptime(end_date, '%Y-%m-%d').date()
                query = query.filter(transaction_date__lte=d)
            except ValueError:
                pass

        if sort_by == 'oldest':
            query = query.order_by('transaction_date', 'id')
        elif sort_by == 'highest':
            query = query.order_by('-amount')
        elif sort_by == 'lowest':
            query = query.order_by('amount')
        else: # newest
            query = query.order_by('-transaction_date', '-id')

        total = query.count()
        pages = (total + per_page - 1) // per_page if per_page > 0 else 1
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        tx_page = query[start_idx:end_idx]

        all_user_txs = Transaction.objects.filter(user=user)
        total_income = sum(t.amount for t in all_user_txs if t.type == 'Income')
        total_expenses = sum(t.amount for t in all_user_txs if t.type == 'Expense')
        current_balance = total_income - total_expenses

        return JsonResponse({
            'transactions': [t.to_dict() for t in tx_page],
            'total': total,
            'page': page,
            'pages': pages,
            'per_page': per_page,
            'summary': {
                'current_balance': current_balance,
                'total_income': total_income,
                'total_expenses': total_expenses,
                'total_transactions': len(all_user_txs)
            }
        }, status=200)

    elif request.method == 'POST':
        data = parse_json(request)
        category_id = data.get('category_id')
        tx_type = data.get('type')
        amount = data.get('amount')
        description = data.get('description', '').strip()
        transaction_date_str = data.get('transaction_date')

        if not tx_type or tx_type not in ['Income', 'Expense']:
            return JsonResponse({'message': 'Transaction type must be Income or Expense.'}, status=400)

        if amount is None or float(amount) <= 0:
            return JsonResponse({'message': 'Amount must be greater than zero.'}, status=400)

        if not description:
            return JsonResponse({'message': 'Description is required.'}, status=400)

        if not transaction_date_str:
            return JsonResponse({'message': 'Transaction date is required.'}, status=400)

        try:
            transaction_date = datetime.strptime(transaction_date_str, '%Y-%m-%d').date()
        except ValueError:
            return JsonResponse({'message': 'Invalid date format. Use YYYY-MM-DD.'}, status=400)

        category = Category.objects.filter(
            Q(user=user) | Q(user__isnull=True),
            id=category_id
        ).first()

        if not category:
            return JsonResponse({'message': 'Invalid category.'}, status=400)

        tx = Transaction.objects.create(
            user=user,
            category=category,
            type=tx_type,
            amount=float(amount),
            description=description,
            transaction_date=transaction_date
        )

        return JsonResponse({'message': 'Transaction added successfully.', 'transaction': tx.to_dict()}, status=201)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


@csrf_exempt
@jwt_required
def transaction_detail(request, tx_id):
    user = request.user_obj
    tx = Transaction.objects.filter(id=tx_id, user=user).first()
    if not tx:
        return JsonResponse({'message': 'Transaction not found.'}, status=404)

    if request.method == 'GET':
        return JsonResponse(tx.to_dict(), status=200)

    elif request.method == 'PUT':
        data = parse_json(request)
        category_id = data.get('category_id', tx.category_id)
        tx_type = data.get('type', tx.type)
        amount = data.get('amount', tx.amount)
        description = data.get('description', tx.description)
        transaction_date_str = data.get('transaction_date')

        if tx_type not in ['Income', 'Expense']:
            return JsonResponse({'message': 'Transaction type must be Income or Expense.'}, status=400)

        if float(amount) <= 0:
            return JsonResponse({'message': 'Amount must be greater than zero.'}, status=400)

        if not str(description).strip():
            return JsonResponse({'message': 'Description is required.'}, status=400)

        if transaction_date_str:
            try:
                tx.transaction_date = datetime.strptime(transaction_date_str, '%Y-%m-%d').date()
            except ValueError:
                return JsonResponse({'message': 'Invalid date format.'}, status=400)

        category = Category.objects.filter(
            Q(user=user) | Q(user__isnull=True),
            id=category_id
        ).first()

        if not category:
            return JsonResponse({'message': 'Invalid category.'}, status=400)

        tx.category = category
        tx.type = tx_type
        tx.amount = float(amount)
        tx.description = str(description).strip()
        tx.save()

        return JsonResponse({'message': 'Transaction updated successfully.', 'transaction': tx.to_dict()}, status=200)

    elif request.method == 'DELETE':
        tx.delete()
        return JsonResponse({'message': 'Transaction deleted successfully.'}, status=200)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


# ----------------------- CATEGORIES VIEWS -----------------------

@csrf_exempt
@jwt_required
def categories_list_create(request):
    user = request.user_obj

    if request.method == 'GET':
        categories = Category.objects.filter(Q(user=user) | Q(user__isnull=True))
        return JsonResponse([c.to_dict() for c in categories], safe=False, status=200)

    elif request.method == 'POST':
        data = parse_json(request)
        name = data.get('category_name', '').strip()
        cat_type = data.get('type')

        if not name:
            return JsonResponse({'message': 'Category name is required.'}, status=400)

        if cat_type not in ['Income', 'Expense']:
            return JsonResponse({'message': 'Category type must be Income or Expense.'}, status=400)

        existing = Category.objects.filter(
            Q(user=user) | Q(user__isnull=True),
            category_name__iexact=name,
            type=cat_type
        ).first()

        if existing:
            return JsonResponse({'message': 'Category already exists.'}, status=400)

        category = Category.objects.create(user=user, category_name=name, type=cat_type)
        return JsonResponse({'message': 'Category added successfully.', 'category': category.to_dict()}, status=201)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


@csrf_exempt
@jwt_required
def category_detail(request, cat_id):
    user = request.user_obj
    category = Category.objects.filter(id=cat_id, user=user).first()
    if not category:
        return JsonResponse({'message': 'Category not found or cannot modify default categories.'}, status=404)

    if request.method == 'PUT':
        data = parse_json(request)
        name = data.get('category_name', '').strip()
        if not name:
            return JsonResponse({'message': 'Category name is required.'}, status=400)
        category.category_name = name
        category.save()
        return JsonResponse({'message': 'Category updated successfully.', 'category': category.to_dict()}, status=200)

    elif request.method == 'DELETE':
        usage_count = Transaction.objects.filter(category=category, user=user).count()
        if usage_count > 0:
            return JsonResponse({'message': f'Cannot delete category because it is currently used by {usage_count} transaction(s).'}, status=400)
        category.delete()
        return JsonResponse({'message': 'Category deleted successfully.'}, status=200)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


# ----------------------- REPORTS VIEWS -----------------------

@csrf_exempt
@jwt_required
def report_monthly(request):
    if request.method != 'GET':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    user = request.user_obj
    year_str = request.GET.get('year')

    qs = Transaction.objects.filter(user=user)
    if year_str:
        try:
            year = int(year_str)
            qs = qs.filter(transaction_date__year=year)
        except ValueError:
            pass

    monthly_data = {m: {'month': m, 'income': 0.0, 'expense': 0.0} for m in range(1, 13)}

    for t in qs:
        m = t.transaction_date.month
        if t.type == 'Income':
            monthly_data[m]['income'] += float(t.amount)
        elif t.type == 'Expense':
            monthly_data[m]['expense'] += float(t.amount)

    return JsonResponse(list(monthly_data.values()), safe=False, status=200)


@csrf_exempt
@jwt_required
def report_yearly(request):
    if request.method != 'GET':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    user = request.user_obj
    qs = Transaction.objects.filter(user=user)
    yearly_dict = {}

    for t in qs:
        y = t.transaction_date.year
        if y not in yearly_dict:
            yearly_dict[y] = {'year': y, 'income': 0.0, 'expense': 0.0}
        if t.type == 'Income':
            yearly_dict[y]['income'] += float(t.amount)
        elif t.type == 'Expense':
            yearly_dict[y]['expense'] += float(t.amount)

    result = sorted(list(yearly_dict.values()), key=lambda x: x['year'])
    return JsonResponse(result, safe=False, status=200)


@csrf_exempt
@jwt_required
def report_category(request):
    if request.method != 'GET':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    user = request.user_obj
    tx_type = request.GET.get('type', 'Expense')

    qs = Transaction.objects.filter(user=user, type=tx_type).values('category__category_name').annotate(total=Sum('amount'))

    res = [{'category_name': item['category__category_name'], 'total': float(item['total'] or 0.0)} for item in qs]
    return JsonResponse(res, safe=False, status=200)


@csrf_exempt
@jwt_required
def export_csv(request):
    user = request.user_obj
    txs = Transaction.objects.filter(user=user).order_by('-transaction_date')

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="transactions_report.csv"'

    writer = csv.writer(response)
    writer.writerow(['ID', 'Date', 'Type', 'Category', 'Description', 'Amount'])

    for t in txs:
        writer.writerow([t.id, t.transaction_date, t.type, t.category.category_name if t.category else '', t.description, t.amount])

    return response


@csrf_exempt
@jwt_required
def export_pdf(request):
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib import colors

    user = request.user_obj
    txs = Transaction.objects.filter(user=user).order_by('-transaction_date')

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []

    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    title_style.alignment = 1

    elements.append(Paragraph("Expense Tracker - Transactions Report", title_style))
    elements.append(Spacer(1, 20))

    data = [['Date', 'Type', 'Category', 'Description', 'Amount']]
    for t in txs:
        data.append([
            str(t.transaction_date),
            t.type,
            t.category.category_name if t.category else 'N/A',
            t.description[:25],
            f"${t.amount:.2f}"
        ])

    t_table = Table(data)
    t_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#4F46E5')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 10),
        ('GRID', (0,0), (-1,-1), 1, colors.lightgrey),
    ]))
    elements.append(t_table)

    doc.build(elements)
    buffer.seek(0)

    response = HttpResponse(buffer.getvalue(), content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="transactions_report.pdf"'
    return response


# ----------------------- BUDGETS VIEWS -----------------------

@csrf_exempt
@jwt_required
def budgets_list_create(request):
    user = request.user_obj

    if request.method == 'GET':
        budgets = Budget.objects.filter(user=user)
        current_date = timezone.localdate()

        result = []
        for b in budgets:
            b_dict = b.to_dict()
            tx_qs = Transaction.objects.filter(
                user=user,
                type='Expense',
                transaction_date__month=current_date.month,
                transaction_date__year=current_date.year
            )
            if b.category_id:
                tx_qs = tx_qs.filter(category_id=b.category_id)

            spent = tx_qs.aggregate(total=Sum('amount'))['total'] or 0.0
            limit = float(b.monthly_limit)
            spent = round(float(spent), 2)
            remaining = round(limit - spent, 2)
            percentage_used = round((spent / limit) * 100, 1) if limit > 0 else 0
            b_dict['spent_amount'] = spent
            b_dict['remaining_amount'] = remaining
            b_dict['percentage_used'] = percentage_used
            b_dict['status'] = 'overspent' if spent > limit else 'warning' if percentage_used >= 80 else 'on_track'
            b_dict['month'] = current_date.strftime('%Y-%m')
            result.append(b_dict)

        return JsonResponse(result, safe=False, status=200)

    elif request.method == 'POST':
        data = parse_json(request)
        category_id = data.get('category_id')
        try:
            monthly_limit = float(data.get('monthly_limit', 0))
        except (TypeError, ValueError):
            monthly_limit = 0

        if monthly_limit <= 0:
            return JsonResponse({'message': 'Monthly limit must be greater than zero.'}, status=400)

        if category_id:
            category = Category.objects.filter(
                Q(user=user) | Q(user__isnull=True),
                id=category_id,
                type='Expense'
            ).first()
            if not category:
                return JsonResponse({'message': 'Invalid expense category.'}, status=400)

        existing = Budget.objects.filter(user=user, category_id=category_id).first()
        if existing:
            existing.monthly_limit = monthly_limit
            existing.save()
        else:
            existing = Budget.objects.create(user=user, category_id=category_id, monthly_limit=monthly_limit)

        return JsonResponse(existing.to_dict(), status=201)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


@csrf_exempt
@jwt_required
def budget_detail(request, budget_id):
    user = request.user_obj
    budget = Budget.objects.filter(id=budget_id, user=user).first()
    if not budget:
        return JsonResponse({'message': 'Budget not found.'}, status=404)

    if request.method == 'DELETE':
        budget.delete()
        return JsonResponse({'message': 'Budget deleted successfully.'}, status=200)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


# ----------------------- RECURRING EXPENSES VIEWS -----------------------

@csrf_exempt
@jwt_required
def recurring_list_create(request):
    user = request.user_obj

    if request.method == 'GET':
        items = RecurringExpense.objects.filter(user=user)
        return JsonResponse([item.to_dict() for item in items], safe=False, status=200)

    elif request.method == 'POST':
        data = parse_json(request)
        title = data.get('title', '').strip()
        amount = float(data.get('amount', 0))
        category_id = data.get('category_id')
        frequency = data.get('frequency', 'Monthly')
        next_due_str = data.get('next_due_date')

        if not title or amount <= 0 or not category_id or not next_due_str:
            return JsonResponse({'message': 'All fields are required.'}, status=400)

        category = Category.objects.filter(Q(user=user) | Q(user__isnull=True), id=category_id).first()
        if not category:
            return JsonResponse({'message': 'Invalid category.'}, status=400)

        next_due_date = datetime.strptime(next_due_str, '%Y-%m-%d').date()

        item = RecurringExpense.objects.create(
            user=user,
            category=category,
            title=title,
            amount=amount,
            frequency=frequency,
            next_due_date=next_due_date
        )
        return JsonResponse(item.to_dict(), status=201)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


@csrf_exempt
@jwt_required
def recurring_pay(request, item_id):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    user = request.user_obj
    item = RecurringExpense.objects.filter(id=item_id, user=user).first()
    if not item:
        return JsonResponse({'message': 'Recurring bill not found.'}, status=404)

    Transaction.objects.create(
        user=user,
        category=item.category,
        type='Expense',
        amount=item.amount,
        description=f"Recurring: {item.title}",
        transaction_date=datetime.utcnow().date()
    )

    if item.frequency == 'Monthly':
        item.next_due_date = item.next_due_date + timedelta(days=30)
    elif item.frequency == 'Weekly':
        item.next_due_date = item.next_due_date + timedelta(days=7)
    elif item.frequency == 'Yearly':
        item.next_due_date = item.next_due_date + timedelta(days=365)

    item.save()
    return JsonResponse({'message': f'Logged expense for {item.title} and updated due date!'}, status=200)


@csrf_exempt
@jwt_required
def recurring_detail(request, item_id):
    user = request.user_obj
    item = RecurringExpense.objects.filter(id=item_id, user=user).first()
    if not item:
        return JsonResponse({'message': 'Recurring bill not found.'}, status=404)

    if request.method == 'DELETE':
        item.delete()
        return JsonResponse({'message': 'Recurring bill deleted.'}, status=200)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


# ----------------------- SAVINGS GOALS VIEWS -----------------------

@csrf_exempt
@jwt_required
def savings_list_create(request):
    user = request.user_obj

    if request.method == 'GET':
        goals = SavingsGoal.objects.filter(user=user)
        return JsonResponse([g.to_dict() for g in goals], safe=False, status=200)

    elif request.method == 'POST':
        data = parse_json(request)
        goal_name = data.get('goal_name', '').strip()
        target_amount = float(data.get('target_amount', 0))
        target_date_str = data.get('target_date')

        if not goal_name or target_amount <= 0:
            return JsonResponse({'message': 'Goal name and positive target amount are required.'}, status=400)

        target_date = datetime.strptime(target_date_str, '%Y-%m-%d').date() if target_date_str else None

        goal = SavingsGoal.objects.create(
            user=user,
            goal_name=goal_name,
            target_amount=target_amount,
            current_amount=float(data.get('current_amount', 0)),
            target_date=target_date
        )
        return JsonResponse(goal.to_dict(), status=201)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


@csrf_exempt
@jwt_required
def savings_deposit(request, goal_id):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    user = request.user_obj
    data = parse_json(request)
    amount = float(data.get('amount', 0))

    if amount <= 0:
        return JsonResponse({'message': 'Deposit amount must be positive.'}, status=400)

    goal = SavingsGoal.objects.filter(id=goal_id, user=user).first()
    if not goal:
        return JsonResponse({'message': 'Savings goal not found.'}, status=404)

    goal.current_amount += amount
    goal.save()
    return JsonResponse(goal.to_dict(), status=200)


@csrf_exempt
@jwt_required
def savings_detail(request, goal_id):
    user = request.user_obj
    goal = SavingsGoal.objects.filter(id=goal_id, user=user).first()
    if not goal:
        return JsonResponse({'message': 'Savings goal not found.'}, status=404)

    if request.method == 'DELETE':
        goal.delete()
        return JsonResponse({'message': 'Savings goal deleted.'}, status=200)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


# ----------------------- SETTINGS VIEWS -----------------------

@csrf_exempt
@jwt_required
def settings_view(request):
    user = request.user_obj
    user_settings = Settings.objects.filter(user=user).first()

    if request.method == 'GET':
        if not user_settings:
            user_settings = Settings.objects.create(
                user=user, theme='light', currency='PHP', date_format='YYYY-MM-DD', notifications=True
            )
        return JsonResponse(user_settings.to_dict(), status=200)

    elif request.method == 'PUT':
        if not user_settings:
            user_settings = Settings.objects.create(user=user)

        data = parse_json(request)
        if 'theme' in data and data['theme'] in ['light', 'dark']:
            user_settings.theme = data['theme']

        if 'currency' in data and data['currency'] in ['PHP', 'USD', 'EUR']:
            user_settings.currency = data['currency']

        if 'date_format' in data:
            user_settings.date_format = data['date_format']

        if 'notifications' in data:
            user_settings.notifications = bool(data['notifications'])

        user_settings.save()
        return JsonResponse({'message': 'Settings saved successfully.', 'settings': user_settings.to_dict()}, status=200)

    return JsonResponse({'message': 'Method not allowed.'}, status=405)


# ----------------------- NOTIFICATIONS VIEWS -----------------------

@csrf_exempt
@jwt_required
def notifications_list(request):
    if request.method != 'GET':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    user = request.user_obj
    notifs = Notification.objects.filter(user=user).order_by('-created_at')[:20]
    return JsonResponse([n.to_dict() for n in notifs], safe=False, status=200)


@csrf_exempt
@jwt_required
def notifications_mark_read(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    user = request.user_obj
    Notification.objects.filter(user=user, is_read=False).update(is_read=True)
    return JsonResponse({'message': 'Notifications marked as read.'}, status=200)


@csrf_exempt
@jwt_required
def notifications_send_digest(request):
    if request.method != 'POST':
        return JsonResponse({'message': 'Method not allowed.'}, status=405)

    user = request.user_obj
    now = datetime.utcnow()
    start_of_month = datetime(now.year, now.month, 1).date()

    tx_income = Transaction.objects.filter(
        user=user, type='Income', transaction_date__gte=start_of_month
    ).aggregate(total=Sum('amount'))['total'] or 0.0

    tx_expense = Transaction.objects.filter(
        user=user, type='Expense', transaction_date__gte=start_of_month
    ).aggregate(total=Sum('amount'))['total'] or 0.0

    balance = tx_income - tx_expense

    body = (
        f"Hi {user.full_name},\n\n"
        f"Here is your Monthly Financial Digest for {now.strftime('%B %Y')}:\n\n"
        f"• Total Monthly Income: ₱{tx_income:,.2f}\n"
        f"• Total Monthly Expense: ₱{tx_expense:,.2f}\n"
        f"• Net Balance: ₱{balance:,.2f}\n\n"
        f"Keep tracking your budget on Expense Tracker System!\n"
    )

    try:
        send_mail(
            subject=f"📊 Your Monthly Financial Digest - {now.strftime('%B %Y')}",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False
        )
        return JsonResponse({'message': f'Digest email sent to {user.email}'}, status=200)
    except Exception as e:
        return JsonResponse({'message': f'Failed to send digest email: {e}'}, status=500)
