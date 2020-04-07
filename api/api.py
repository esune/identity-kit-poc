import os

import flask_admin as admin
from flask import Flask
from flask_mongoengine import MongoEngine
from flask_oidc_ex import OpenIDConnect

from models.issuer_invite import IssuerInvite
from views.issuer_invite import IssuerInviteView
from views.my_home import MyHomeView


def parse_bool(val):
    return val and val != "0" and str(val).lower() != "false"


debug = os.environ.get("DEBUG", "false")

# Create application
app = Flask(__name__)

app.config.update(
    {
        "SECRET_KEY": os.environ.get("SECRET_KEY"),
        "MONGODB_SETTINGS": {
            "db": os.environ.get("DB_DATABASE"),
            "host": os.environ.get("DB_HOST"),
            "port": int(os.environ.get("DB_PORT", 27017)),
            "username": os.environ.get("DB_USER"),
            "password": os.environ.get("DB_PASSWORD"),
        },
        "TESTING": parse_bool(debug),
        "DEBUG": parse_bool(debug),
        "OIDC_CLIENT_SECRETS": "config/client_secrets.json",
        "OIDC_SCOPES": ["openid", "email", "profile"],
    }
)

# Init database manager
db = MongoEngine()
db.init_app(app)

# Init OIDC manager
oidc = OpenIDConnect(app)


# Create admin
admin = admin.Admin(app, index_view=MyHomeView(name="Home", url="/"))

# Add views
admin.add_view(IssuerInviteView(IssuerInvite))

# Start app
app.run()
