import os

import flask_admin as admin
from flask import Flask, jsonify, redirect, render_template, request, session, url_for
from flask_mongoengine import MongoEngine
from flask_pyoidc import OIDCAuthentication
from flask_pyoidc.provider_configuration import (
    ClientMetadata,
    ProviderConfiguration,
    ProviderMetadata,
)

from .models.issuer_invite import IssuerInvite
from .views.issuer_invite import IssuerInviteView

# from .views.my_home import MyHomeView


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
        "OIDC_REDIRECT_URI": "http://localhost:5000/redirect_uri",
    }
)

# Init database manager
db = MongoEngine()
db.init_app(app)

# provider_metadata = ProviderMetadata(
#     issuer="https://sso-test.pathfinder.gov.bc.ca/auth/realms/gzyg46lx",
#     authorization_endpoint="https://sso-test.pathfinder.gov.bc.ca/auth/realms/gzyg46lx/protocol/openid-connect/auth",
#     token_endpoint="https://sso-test.pathfinder.gov.bc.ca/auth/realms/gzyg46lx/protocol/openid-connect/token",
#     userinfo_endpoint="https://sso-test.pathfinder.gov.bc.ca/auth/realms/gzyg46lx/protocol/openid-connect/userinfo",
#     jwks_uri="https://sso-test.pathfinder.gov.bc.ca/auth/realms/gzyg46lx/protocol/openid-connect/certs",
# )

# Init OIDC client
config = ProviderConfiguration(
    # issuer=f"{os.environ.get('KEYCLOAK_HOST')}/auth/realms/{os.environ.get('KEYCLOAK_REALM')}",
    issuer="https://sso-test.pathfinder.gov.bc.ca/auth/realms/gzyg46lx",
    # provider_metadata=provider_metadata,
    client_metadata=ClientMetadata(
        client_id=os.environ.get("KEYCLOAK_CLIENT"),
        # client_secret=os.environ.get("KEYCLOAK_SECRET"),
        client_secret="f9c8761a-d241-4490-af58-9a2e0f40552c",
    ),
)
auth = OIDCAuthentication({"default": config}, app)

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
            return "You are unauthorized"


@app.route("/logout")
@auth.oidc_logout
def logout():
    return render_template("logout.html")


@app.route("/unauthorized")
def unauthorized():
    return render_template("unauthorized.html")


# Create admin
admin = admin.Admin(app, index_view=MyHomeView(name="Home", url="/"))

# Add views
admin.add_view(IssuerInviteView(IssuerInvite))

# Start app
app.run()
