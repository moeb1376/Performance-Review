from accounts.models import User
from core.enums import Phase, State
from core.interactors.authorization import can_write_person_review, can_view_person_review_reviewer, \
    can_view_self_person_review, can_view_peer_person_review, can_view_person_review_mention_list
from core.interactors.settings import is_at_phase, get_active_round
from core.interactors.utils import filter_query_set_for_manager_review
from core.models import PersonReview, MAX_TEXT_LENGTH


def set_person_review_mention_user(person_review: PersonReview, mention_users):
    if mention_users is not None:
        mention_users = mention_users[:person_review.round.max_reviewers]
        person_review.mention_users.clear()
        for mention_user in mention_users:
            if mention_user == person_review.reviewee:
                continue
            if mention_user == person_review.reviewee.manager:
                continue
            if mention_user not in person_review.round.participants.all():
                continue
            person_review.mention_users.add(mention_user)


def save_person_review(reviewee, reviewer, mention_users, **kwargs):
    person_review = get_or_create_person_review(reviewee=reviewee, reviewer=reviewer)

    if person_review is None:
        return None

    fields = ['strengths', ]
    for field in fields:
        if field in kwargs:
            value = kwargs.get(field)
            value = list(map(lambda v: v[:MAX_TEXT_LENGTH], value))
            setattr(person_review, field, value)

    state = kwargs.get('state', State.DOING.value)
    person_review.state = state
    person_review.strength = kwargs.get('strength', "")
    set_person_review_mention_user(person_review, mention_users)

    person_review.save()
    return person_review


def get_all_person_reviews(user):
    if not user.is_authenticated:
        return PersonReview.objects.none()
    if is_at_phase(Phase.SELF_REVIEW):
        return PersonReview.objects.filter(round=get_active_round(), reviewer=user, reviewee=user)
    if is_at_phase(Phase.MANAGER_ADJUSTMENT):
        qs = PersonReview.objects.filter(round=get_active_round())
        return filter_query_set_for_manager_review(user, qs, 'reviewee')
    if is_at_phase(Phase.PEER_REVIEW):
        return PersonReview.objects.filter(round=get_active_round(), reviewer=user).exclude(reviewee=user)
    if is_at_phase(Phase.MANAGER_REVIEW):
        qs = PersonReview.objects.filter(round=get_active_round())
        return filter_query_set_for_manager_review(user, qs, 'reviewee')
    if is_at_phase(Phase.RESULTS):
        return PersonReview.objects.filter(round=get_active_round(), reviewee=user)
    return PersonReview.objects.none()


def get_user_person_reviews(user, reviewee):
    return get_all_person_reviews(user).filter(reviewee=reviewee)


def get_or_create_person_review(*, reviewee, reviewer):
    if not can_write_person_review(reviewer, reviewee):
        return None
    person_review, _ = PersonReview.objects.get_or_create(
        round=get_active_round(),
        reviewee=reviewee,
        reviewer=reviewer
    )
    return person_review


def get_or_create_self_person_review(*, reviewee, user):
    if not can_view_self_person_review(user, reviewee):
        return None
    try:
        person_review = PersonReview.objects.get(
            round=get_active_round(),
            reviewee=reviewee,
            reviewer=reviewee,
        )
    except PersonReview.DoesNotExist:
        person_review = get_or_create_person_review(reviewee=reviewee, reviewer=reviewee)
    return person_review


def get_or_create_peer_person_review(*, reviewee, user):
    if not can_view_peer_person_review(user, reviewee):
        return None
    try:
        person_review = PersonReview.objects.get(
            round=get_active_round(),
            reviewee=reviewee,
            reviewer=user,
        )
    except PersonReview.DoesNotExist:
        person_review = get_or_create_person_review(reviewee=reviewee, reviewer=user)
    return person_review


def get_person_review(user, id):
    try:
        return get_all_person_reviews(user).get(id=id)
    except PersonReview.DoesNotExist:
        return None


def get_person_review_reviewer(user, person_review):
    if not can_view_person_review_reviewer(user, person_review):
        return None
    return person_review.reviewer


def get_person_review_mention_list(user, person_review):
    if not can_view_person_review_mention_list(user, person_review):
        return User.objects.none()
    return person_review.mention_users.all()
