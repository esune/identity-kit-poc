from flask import Blueprint
from flask_pyoidc import OIDCAuthentication

from app.auth.oidc import get_oidc_config

bp = Blueprint("auth", __name__)
auth = OIDCAuthentication({"default": get_oidc_config()})

from app.auth import routes
