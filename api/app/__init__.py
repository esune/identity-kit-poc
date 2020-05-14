import flask_admin
from flask import Flask, redirect, render_template, session, url_for
from flask_admin import AdminIndexView, expose
from flask_mail import Mail
from flask_mongoengine import MongoEngine
from flask_pyoidc import OIDCAuthentication
from flask_pyoidc.user_session import UserSession

from app.admin.views.issuer_invite import IssuerInviteView
from app.api import bp as api_bp
from app.auth.oidc import get_oidc_config
from app.models.issuer_invite import IssuerInvite
from config import Config

db = MongoEngine()
mail = Mail()
auth = OIDCAuthentication({"default": get_oidc_config()})


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
            return redirect(url_for("unauthorized"))


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    with app.app_context():
        db.init_app(app)
        mail.init_app(app)
        auth.init_app(app)

        #  init blueprints
        app.register_blueprint(api_bp, url_prefix="/api")

        # create admin dashboard and custom view
        admin = flask_admin.Admin(
            app=app, index_view=MyHomeView(name="Home", url="/admin")
        )
        admin.add_view(IssuerInviteView(IssuerInvite))

        # register endpoints
        @app.route("/logout")
        @auth.oidc_logout
        def logout():
            return redirect(url_for("admin.index"))

        @app.route("/unauthorized")
        @auth.oidc_logout
        def unauthorized():
            return render_template("auth/unauthorized.html")

    return app
