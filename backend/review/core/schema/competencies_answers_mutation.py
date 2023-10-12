import graphene
from graphene import ClientIDMutation

from core.interactors.competencies import create_competencies_answers, update_competencies_answers
from core.schema.competencies_query import CompetenciesAnswersNode
from core.schema.enums import CompetenciesEvaluation
from graphql_api.schema.with_viewer import WithViewer


class CompetenciesAnswersMutation(WithViewer, ClientIDMutation):
    class Input:
        competencies_answers_id = graphene.Int()
        competencies_id = graphene.Int()
        rating = CompetenciesEvaluation()
        evidence = graphene.String()
        is_target = graphene.Boolean()

    competencies_answers = graphene.Field(CompetenciesAnswersNode)

    @classmethod
    def mutate_and_get_payload(cls, root, info, **kwargs):
        user = info.context.user
        competencies_answers_id = kwargs.get('competencies_answers_id', None)
        if competencies_answers_id:
            competencies_answer = update_competencies_answers(user=user, **kwargs)
        else:
            competencies_answer = create_competencies_answers(user=user, **kwargs)
        return CompetenciesAnswersMutation(competencies_answers=competencies_answer)
