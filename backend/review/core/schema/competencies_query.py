import graphene
from graphene import relay
from graphene_django import DjangoObjectType

from core.interactors.competencies import get_competencies_answer_rating, get_competencies, get_competencies_answers, \
    get_all_competencies_user_answers, get_all_competencies_user
from core.schema.enums import CompetenciesEvaluation
from ..models import Competencies, CompetenciesAnswers


class CompetenciesNode(DjangoObjectType):
    class Meta:
        model = Competencies
        fields = [
            'name',
            'help_text'
        ]
        interfaces = (relay.Node,)

    @classmethod
    def get_node(cls, info, id):
        return get_competencies(info.context.user, id)


class CompetenciesAnswersNode(DjangoObjectType):
    class Meta:
        model = CompetenciesAnswers
        fields = [
            'user',
            'competencies',
            'evidence',
            'is_target'
        ]
        interfaces = (relay.Node,)

    rating = CompetenciesEvaluation()

    def resolve_rating(self, info):
        return get_competencies_answer_rating(self)

    @classmethod
    def get_node(cls, info, id):
        return get_competencies_answers(info.context.user, id)


class CompetenciesQuery(graphene.ObjectType):
    competencie = relay.Node.Field(CompetenciesNode)
    competencies = graphene.List(graphene.NonNull(CompetenciesNode), required=True)
    competencies_user_answers = graphene.List(graphene.NonNull(CompetenciesAnswersNode), required=True)

    def resolve_competencies(self, info):
        return get_all_competencies_user(info.context.user)

    def resolve_competencies_user_answers(self, info):
        return get_all_competencies_user_answers(info.context.user)
