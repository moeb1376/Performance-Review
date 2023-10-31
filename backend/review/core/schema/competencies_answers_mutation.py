import graphene
from graphene import ClientIDMutation

from core.interactors.competencies import create_competencies_answers, update_competencies_answers
from core.models import Competencies, CompetenciesAnswers
from core.schema.competencies_query import CompetenciesAnswersNode
from core.schema.enums import CompetenciesEvaluation
from graphql_api.schema.with_viewer import WithViewer
from .utils import get_node


class CompetenciesAnswersMutation(WithViewer, ClientIDMutation):
    class Input:
        competencies_answers_id = graphene.ID()
        competencies_id = graphene.NonNull(graphene.ID)
        rating = CompetenciesEvaluation()
        evidence = graphene.String()
        is_target = graphene.Boolean()

    competencies_answers = graphene.Field(CompetenciesAnswersNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **kwargs):
        user = info.context.user
        competencies_answers_id = kwargs.get('competencies_answers_id', None)
        competencies = get_node(kwargs.get("competencies_id"), info, Competencies)
        kwargs["competencies_id"] = competencies.id
        if competencies_answers_id:
            competencies_answers_id = get_node(competencies_answers_id, info, CompetenciesAnswers)
            kwargs["competencies_answers_id"] = competencies_answers_id.id
            competencies_answer = update_competencies_answers(user=user, **kwargs)
        else:
            competencies_answer = create_competencies_answers(user=user, **kwargs)
        return CompetenciesAnswersMutation(competencies_answers=competencies_answer)
