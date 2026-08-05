import os
import sys

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_tracker.settings')
    from django.core.management import execute_from_command_line
    port = os.getenv('PORT', '5000')
    sys.argv = ['manage.py', 'runserver', f'0.0.0.0:{port}']
    execute_from_command_line(sys.argv)
