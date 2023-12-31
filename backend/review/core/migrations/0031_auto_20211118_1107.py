# Generated by Django 3.1.2 on 2021-11-18 11:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0030_auto_20211116_1857'),
    ]

    operations = [
        migrations.AddField(
            model_name='round',
            name='self_review_execution_help_modal_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='round',
            name='self_review_leadership_help_modal_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='round',
            name='self_review_presence_help_modal_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='round',
            name='self_review_problem_solving_help_modal_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='round',
            name='self_review_project_review_help_modal_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='round',
            name='self_review_sahabiness_help_modal_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='round',
            name='self_review_thought_leadership_help_modal_text',
            field=models.TextField(blank=True, null=True),
        ),
    ]
