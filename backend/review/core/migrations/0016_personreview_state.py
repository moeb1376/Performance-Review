# Generated by Django 3.0 on 2020-02-17 12:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_remove_personreview_final_submit'),
    ]

    operations = [
        migrations.AddField(
            model_name='personreview',
            name='state',
            field=models.IntegerField(choices=[(1, 'TODO'), (2, 'DOING'), (3, 'DONE')], default=1),
        ),
    ]