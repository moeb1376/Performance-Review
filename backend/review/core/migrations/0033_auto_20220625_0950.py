# Generated by Django 3.1.2 on 2022-06-25 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0032_projectreview_consulted_with_manager'),
    ]

    operations = [
        migrations.AddField(
            model_name='participation',
            name='has_started_manager_adjustment',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='projectreview',
            name='approved_by_manager',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='round',
            name='start_text_manager_adjustment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='round',
            name='phase',
            field=models.IntegerField(choices=[(1, 'SELF_REVIEW'), (2, 'PEER_REVIEW'), (3, 'MANAGER_REVIEW'), (4, 'RESULTS'), (5, 'IDLE'), (6, 'MANAGER_ADJUSTMENT')]),
        ),
    ]
