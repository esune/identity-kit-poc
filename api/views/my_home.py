import os

from flask import render_template, session
from flask_admin import AdminIndexView, expose


class MyHomeView(AdminIndexView):
    @expose("/")
    @auth.oidc_auth("default")
    def index(self):
        id_token = session["id_token"]
        client_name = os.environ.get("KEYCLOAK_CLIENT")
        if client_name in id_token and "admin" in id_token[client_name]["roles"]:
            return super(MyHomeView, self).index()
        else:
            return render_template("unauthorized.html")
