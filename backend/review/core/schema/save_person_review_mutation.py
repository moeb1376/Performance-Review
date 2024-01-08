import graphene
from graphene import ClientIDMutation

from accounts.models import User
from core.interactors.person_review import save_person_review
from core.schema.enums import State
from core.schema.person_review_query import PersonReviewNode
from core.schema.utils import convert_ids_to_reviewers
from graphql_api.schema.utils import get_node
from graphql_api.schema.with_viewer import WithViewer


class SavePersonReviewMutation(WithViewer, ClientIDMutation):
    class Input:
        reviewee_id = graphene.NonNull(graphene.ID)
        # strengths = graphene.List(graphene.NonNull(graphene.String))
        strength = graphene.NonNull(graphene.String)
        mention_users_id = graphene.List(graphene.NonNull(graphene.ID))
        state = State()

    person_review = graphene.Field(PersonReviewNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **args):
        reviewee = get_node(args['reviewee_id'], info, User)
        reviewer = info.context.user
        mention_users = convert_ids_to_reviewers(args.pop('mention_users_id', None), info)

        if reviewee is None:
            return SavePersonReviewMutation(person_review=None)

        person_review = save_person_review(reviewee=reviewee, reviewer=reviewer, mention_users=mention_users, **args)
        return SavePersonReviewMutation(person_review=person_review)
