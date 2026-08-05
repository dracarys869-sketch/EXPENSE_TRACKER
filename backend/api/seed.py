from api.models import Category, Settings

DEFAULT_INCOME_CATEGORIES = [
    'Salary', 'Bonus', 'Investment', 'Freelance', 'Business', 'Other'
]

DEFAULT_EXPENSE_CATEGORIES = [
    'Food', 'Transportation', 'Bills', 'Shopping', 'Entertainment',
    'Education', 'Health', 'Rent', 'Internet', 'Utilities', 'Travel', 'Other'
]

def seed_user_defaults(user_id):
    """Seed initial categories & settings for newly registered user."""
    # Seed Income Categories
    for name in DEFAULT_INCOME_CATEGORIES:
        Category.objects.create(user_id=user_id, category_name=name, type='Income')
        
    # Seed Expense Categories
    for name in DEFAULT_EXPENSE_CATEGORIES:
        Category.objects.create(user_id=user_id, category_name=name, type='Expense')
        
    # Seed User Settings
    Settings.objects.create(
        user_id=user_id,
        theme='light',
        currency='PHP',
        date_format='YYYY-MM-DD',
        notifications=True
    )
