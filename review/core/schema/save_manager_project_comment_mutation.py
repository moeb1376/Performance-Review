import graphene
from graphene import ClientIDMutation

from core.interactors.manager_review import save_manager_project_comment
from core.models import ProjectReview
from core.schema.enums import Evaluation
from core.schema.project_comment_query import ProjectCommentNode
from graphql_api.schema.utils import get_node
from graphql_api.schema.with_viewer import WithViewer


class SaveManagerProjectCommentMutation(WithViewer, ClientIDMutation):
    class Input:
        project_review_id = graphene.NonNull(graphene.ID)
        rating = Evaluation()

    manager_project_comment = graphene.Field(ProjectCommentNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **args):
        project_review = get_node(args['project_review_id'], info, ProjectReview)
        user = info.context.user

        if project_review is None:
            return SaveManagerProjectCommentMutation(manager_project_comment=None)

        manager_project_comment = save_manager_project_comment(project_review, user, **args)
        return SaveManagerProjectCommentMutation(manager_project_comment=manager_project_comment)
