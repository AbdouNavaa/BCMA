# Generated by Django 5.0.6 on 2024-12-17 11:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bcmApp', '0003_action_type_alter_files_type'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='type',
            name='actions',
        ),
        migrations.AddField(
            model_name='action',
            name='type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='type', to='bcmApp.type'),
        ),
    ]
