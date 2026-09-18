from django.core.management.base import BaseCommand, CommandError

from api.models import User


class Command(BaseCommand):
    help = 'Grant administrator access to an existing user by email.'

    def add_arguments(self, parser):
        parser.add_argument('email')

    def handle(self, *args, **options):
        email = options['email'].strip().lower()
        user = User.objects.filter(email=email).first()
        if not user:
            raise CommandError(f'No user found for {email}.')
        user.is_admin = True
        user.save(update_fields=['is_admin'])
        self.stdout.write(self.style.SUCCESS(f'{email} is now an administrator.'))