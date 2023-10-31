from core.interactors.settings import get_active_round
from core.models import CompetenciesAnswers, Competencies


def get_competencies_answer_rating(competencies_answer):
    return competencies_answer.rating


def get_all_competencies_user_answers(user):
    if not user.is_authenticated:
        return CompetenciesAnswers.objects.none()
    return CompetenciesAnswers.objects.filter(user=user).select_related("competencies", "user")


def get_competencies_answers(user, id):
    return get_all_competencies_user_answers(user=user).get(id=id)


def get_all_competencies_user(user):
    if not user.is_authenticated:
        return Competencies.objects.none()
    return Competencies.objects.all()


def get_competencies(user, id):
    return get_all_competencies_user(user=user).get(id=id)


def create_competencies_answers(user, competencies_id, rating, evidence, is_target):
    if is_target:
        if CompetenciesAnswers.objects.filter(user=user,
                                              is_target=True).count() >= get_active_round().max_competency_target:
            return None
    competencies_answers_obj, created = CompetenciesAnswers.objects.get_or_create(competencies_id=competencies_id,
                                                                                  user=user, rating=rating.value,
                                                                                  evidence=evidence,
                                                                                  is_target=is_target)
    if created:
        return competencies_answers_obj
    return None


def update_competencies_answers(competencies_answers_id, user, competencies_id, rating, evidence, is_target):
    try:
        obj = CompetenciesAnswers.objects.get(id=competencies_answers_id, user=user, competencies_id=competencies_id)
        if is_target and not obj.is_target:
            if CompetenciesAnswers.objects.filter(user=user,
                                                  is_target=True).count() >= get_active_round().max_competency_target:
                return None
        obj.rating = rating.value
        obj.evidence = evidence
        obj.is_target = is_target
        obj.save()
        return obj
    except Exception as e:
        return None
