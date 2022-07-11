# Generated by Django 3.1.2 on 2022-07-05 11:35

from django.db import migrations

from core.enums import QuestionType


def create_questions(apps):
    Question = apps.get_model('core', 'Question')
    self_question = Question.objects.create(
        question_type=QuestionType.TEXT.value,
        label='توضیح فعالیت',
        help_text='خروجی‌ها و دستاوردهایی که نشان‌دهندهٔ تاثیر شما در این پروژه بوده؛ به عنوان مثال نتایج کلیدی شما '
                  'در دورهٔ اخیر ',
    )
    peer_question = Question.objects.create(
        question_type=QuestionType.TEXT.value,
        label='شواهد و بازخورد',
    )

    Round = apps.get_model('core', 'Round')
    for round in Round.objects.all():
        round.self_review_project_questions.add(self_question)
        round.peer_review_project_questions.add(peer_question)

    return self_question, peer_question


def fill_answers(apps, self_question, peer_question):
    ProjectReview = apps.get_model('core', 'ProjectReview')
    for project_review in ProjectReview.objects.all():
        if project_review.text:
            project_review.answers.create(question=self_question, value=project_review.text)

    ProjectComment = apps.get_model('core', 'ProjectComment')
    for project_comment in ProjectComment.objects.all():
        if project_comment.text:
            project_comment.answers.create(question=peer_question, value=project_comment.text)


def create_and_fill_qas(apps, schema_editor):
    self_question, peer_question = create_questions(apps)
    fill_answers(apps, self_question, peer_question)


def fill_texts_and_delete_qas(apps, schema_editor):
    ProjectReview = apps.get_model('core', 'ProjectReview')
    for project_review in ProjectReview.objects.all():
        answer = project_review.answers.first()
        project_review.text = answer.value if answer else None
        project_review.save()

    ProjectComment = apps.get_model('core', 'ProjectComment')
    for project_comment in ProjectComment.objects.all():
        answer = project_comment.answers.first()
        project_comment.text = answer.value if answer else None
        project_comment.save()

    Answer = apps.get_model('core', 'Answer')
    Answer.objects.all().delete()

    Question = apps.get_model('core', 'Question')
    Question.objects.all().delete()


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0036_auto_20220705_1128'),
    ]

    operations = [
        migrations.RunPython(create_and_fill_qas, fill_texts_and_delete_qas)
    ]
