import flask_admin
from flask import Flask
from flask_mail import Mail
from flask_mongoengine import MongoEngine

from app.admin.views.issuer_invite import IssuerInviteView
from app.admin.views.my_home import MyHomeView
from app.api import bp as api_bp
from app.auth import bp as auth_bp
from app.models.issuer_invite import IssuerInvite
from config import Config

db = MongoEngine()
mail = Mail()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    with app.app_context():
        db.init_app(app)
        mail.init_app(app)

        #  init blueprints
        app.register_blueprint(api_bp, url_prefix="/api")
        app.register_blueprint(auth_bp, url_prefix="/auth")

        # create admin dashboard and custom view
        admin = flask_admin.Admin(
            app=app, index_view=MyHomeView(name="Home", url="/admin")
        )
        admin.add_view(IssuerInviteView(IssuerInvite))

    return app
