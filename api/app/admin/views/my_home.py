from flask import redirect, session, url_for
from flask_admin import AdminIndexView, expose
from flask_pyoidc.user_session import UserSession

from app.auth import auth
from config import Config


class MyHomeView(AdminIndexView):
    @expose("/")
    @auth.oidc_auth("default")
    def index(self):
        user_session = UserSession(session)
        client_name = Config.OIDC_CLIENT
        if (
            client_name in user_session.id_token
            and "admin" in user_session.id_token[client_name]["roles"]
        ):
            return super(MyHomeView, self).index()
        else:
            return redirect(url_for("auth.unauthorized"))
