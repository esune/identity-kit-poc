import os


def parse_bool(val):
    return val and val != "0" and str(val).lower() != "false"


debug = os.environ.get("DEBUG", "false")


class Config(object):
    SECRET_KEY = os.environ.get("SECRET_KEY")
    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_PORT = int(os.environ.get("MAIL_PORT") or 25)
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS") is not None
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_FROM_ADDR = os.environ.get("MAIL_FROM_ADDR")
    MONGODB_SETTINGS = {
        "db": os.environ.get("DB_DATABASE"),
        "host": os.environ.get("DB_HOST"),
        "port": int(os.environ.get("DB_PORT", 27017)),
        "username": os.environ.get("DB_USER"),
        "password": os.environ.get("DB_PASSWORD"),
    }
    TESTING = parse_bool(debug)
    DEBUG = parse_bool(debug)
    OIDC_REDIRECT_URI = os.environ.get("OIDC_REDIRECT_URI")
    OIDC_ISSUER = os.environ.get("OIDC_ISSUER")
    OIDC_CLIENT = os.environ.get("OIDC_CLIENT")
    OIDC_SECRET = os.environ.get("OIDC_SECRET")
    OIDC_POST_LOGOUT_REDIRECT_URI = os.environ.get("OIDC_POST_LOGOUT_REDIRECT_URI")
    AGENT_ADMIN_API_KEY = os.environ.get("AGENT_ADMIN_API_KEY")
