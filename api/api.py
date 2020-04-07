import os

import flask_admin as admin
from flask import Flask, redirect, url_for
from flask_mongoengine import MongoEngine
from flask_oidc_ex import OpenIDConnect

from models.issuer_invite import IssuerInvite
from views.issuer_invite import IssuerInviteView

# Create application
app = Flask(__name__)

# Create secrey key so we can use sessions
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

# Init database manager
app.config["MONGODB_SETTINGS"] = {
    "db": os.environ.get("DB_DATABASE"),
    "host": os.environ.get("DB_HOST"),
    "port": int(os.environ.get("DB_PORT", 27017)),
    "username": os.environ.get("DB_USER"),
    "password": os.environ.get("DB_PASSWORD"),
}
db = MongoEngine()
db.init_app(app)

# Init OIDC manager
oidc = OpenIDConnect(app)

# Flask views
@app.route("/")
def index():
    if oidc.user_loggedin:
        return redirect(url_for("admin"))
    else:
        return "<h1>Unauthorized</h1>"
    # return '<a href="/admin/">Click me to get to Admin!</a>'


if __name__ == "__main__":
    # Create admin
    admin = admin.Admin(app, "Issuer Admin")

    # Add views
    admin.add_view(IssuerInviteView(IssuerInvite))

    # Start app
    app.run(debug=True)
