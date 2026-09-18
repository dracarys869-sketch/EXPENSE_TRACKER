from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

class User(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, db_index=True)
    password_hash = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_expiry = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'users'

    def set_password(self, password):
        self.password_hash = make_password(password)

    def check_password(self, password):
        # Also handle legacy raw bcrypt check if needed
        if self.password_hash.startswith('$2b$') or self.password_hash.startswith('$2a$'):
            import bcrypt
            return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
        return check_password(password, self.password_hash)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'is_active': self.is_active,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    category_name = models.CharField(max_length=50)
    type = models.CharField(max_length=10) # 'Income' or 'Expense'

    class Meta:
        db_table = 'categories'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_name': self.category_name,
            'type': self.type
        }


class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions', db_index=True)
    category = models.ForeignKey(Category, on_delete=models.RESTRICT, related_name='transactions')
    type = models.CharField(max_length=10) # 'Income' or 'Expense'
    amount = models.FloatField()
    description = models.CharField(max_length=255)
    transaction_date = models.DateField(db_index=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'transactions'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_id': self.category_id,
            'category_name': self.category.category_name if self.category else 'Unknown',
            'type': self.type,
            'amount': float(self.amount),
            'description': self.description,
            'transaction_date': self.transaction_date.strftime('%Y-%m-%d') if self.transaction_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Settings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='settings')
    theme = models.CharField(max_length=10, default='light')
    currency = models.CharField(max_length=10, default='USD')
    date_format = models.CharField(max_length=20, default='YYYY-MM-DD')
    notifications = models.BooleanField(default=True)

    class Meta:
        db_table = 'settings'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'theme': self.theme,
            'currency': self.currency,
            'date_format': self.date_format,
            'notifications': self.notifications
        }


class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='budgets', db_index=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='budgets', null=True, blank=True)
    monthly_limit = models.FloatField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'budgets'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_id': self.category_id,
            'category_name': self.category.category_name if self.category else 'Overall Monthly Limit',
            'monthly_limit': float(self.monthly_limit),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class RecurringExpense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recurring_expenses', db_index=True)
    category = models.ForeignKey(Category, on_delete=models.RESTRICT, related_name='recurring_expenses')
    title = models.CharField(max_length=100)
    amount = models.FloatField()
    frequency = models.CharField(max_length=20, default='Monthly')
    next_due_date = models.DateField()
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'recurring_expenses'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'category_id': self.category_id,
            'category_name': self.category.category_name if self.category else 'Unknown',
            'title': self.title,
            'amount': float(self.amount),
            'frequency': self.frequency,
            'next_due_date': self.next_due_date.strftime('%Y-%m-%d') if self.next_due_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class SavingsGoal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='savings_goals', db_index=True)
    goal_name = models.CharField(max_length=100)
    target_amount = models.FloatField()
    current_amount = models.FloatField(default=0.0)
    target_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'savings_goals'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'goal_name': self.goal_name,
            'target_amount': float(self.target_amount),
            'current_amount': float(self.current_amount),
            'target_date': self.target_date.strftime('%Y-%m-%d') if self.target_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications', db_index=True)
    title = models.CharField(max_length=150)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        db_table = 'notifications'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class AuditLog(models.Model):
    actor_id = models.IntegerField(null=True, blank=True)
    action = models.CharField(max_length=100)
    target_type = models.CharField(max_length=50, blank=True)
    target_id = models.CharField(max_length=50, blank=True)
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        db_table = 'audit_logs'

    def to_dict(self):
        return {
            'id': self.id,
            'actor_id': self.actor_id,
            'actor_name': User.objects.filter(id=self.actor_id).values_list('full_name', flat=True).first() or 'System',
            'action': self.action,
            'target_type': self.target_type,
            'target_id': self.target_id,
            'details': self.details,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
