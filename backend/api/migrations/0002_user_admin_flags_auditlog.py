from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='is_admin',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='AuditLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(max_length=100)),
                ('target_type', models.CharField(blank=True, max_length=50)),
                ('target_id', models.CharField(blank=True, max_length=50)),
                ('details', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(db_index=True, default=django.utils.timezone.now)),
                ('actor_id', models.IntegerField(blank=True, null=True)),
            ],
            options={'db_table': 'audit_logs'},
        ),
    ]