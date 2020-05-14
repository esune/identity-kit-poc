from flask import request
from flask_restplus import Resource, fields

from app.api import api


@api.route(
    "/connection/<string:connection_id>",
    doc={"description": "Request the status for the connection with the specified id."},
)
class CheckConnection(Resource):
    def get(self, connection_id):
        return {"connection_id": connection_id}


resource_fields = api.model("Resource", {"name": fields.String})


@api.route(
    "/connection", doc={"description": "Request a new connection invitation."},
)
class NewConnection(Resource):
    @api.expect(resource_fields, validate=True)
    def post(self):
        return {"status": "not implemented"}


@api.route(
    "/credential", doc={"description": "Request a new credential to be issued."},
)
class RequestCredential(Resource):
    def post(self):
        return {"status": "not implemented"}


@api.route(
    "/credential/<string:credential_exchange_id>",
    doc={
        "description": "Check the status of the credential exchange with the specified id."
    },
)
class CheckCredential(Resource):
    def get(self, credential_exchange_id):
        return {"connection_id": credential_exchange_id}


@api.route(
    "/schemas", doc={"description": "List all the schemas supported by this issuer."},
)
class ListSchemas(Resource):
    def get(self):
        return {"status": "not implemented"}


@api.route(
    "/schema/id/<string:schema_id>",
    doc={"description": "Get the details for teh schema with the specified id."},
)
class SchemasById(Resource):
    def get(self, schema_id):
        return {"status": "not implemented"}


@api.route(
    "/schema/name/<string:schema_name>",
    doc={"description": "Get the details for teh schema with the specified name."},
)
class SchemasById(Resource):
    def get(self, schema_name):
        return {"status": "not implemented"}


# @api.route("/<string:todo_id>")
# class TodoSimple(Resource):
#     def get(self, todo_id):
#         return {todo_id: todos[todo_id]}

#     def put(self, todo_id):
#         todos[todo_id] = request.form["data"]
#         return {todo_id: todos[todo_id]}
