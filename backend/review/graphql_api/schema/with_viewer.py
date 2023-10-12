from graphene import Field

from graphql_api.schema.viewer_node import ViewerNode


class WithViewer:
    viewer = Field(ViewerNode, required=True)

    def resolve_viewer(self, info):
        return ViewerNode(id="0")
