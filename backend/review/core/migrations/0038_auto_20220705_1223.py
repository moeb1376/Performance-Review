# Generated by Django 3.1.2 on 2022-07-05 12:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0037_add_questions_answers'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='projectcomment',
            name='text',
        ),
        migrations.RemoveField(
            model_name='projectreview',
            name='text',
        ),
    ]
