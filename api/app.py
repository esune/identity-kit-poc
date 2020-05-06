import os

import flask_admin as admin
from flask import Flask, redirect, render_template, request, url_for
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from flask_mongoengine import MongoEngine
from werkzeug.security import check_password_hash, generate_password_hash

from .forms.registration import RegistrationForm
from .models.issuer_invite import IssuerInvite
from .models.user import User
from .views.issuer_invite import IssuerInviteView
from .views.my_home import MyHomeView


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
        "OIDC_CLIENT_SECRETS": "client_secrets.json",
        "OIDC_SCOPES": ["openid", "email", "profile"],
    }
)

# Init database manager
db = MongoEngine()
db.init_app(app)

# Init login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@login_manager.user_loader
def load_user(user_id):
    return User.objects(pk=user_id).first()


@app.route("/register", methods=["GET", "POST"])
def register():
    form = RegistrationForm()
    if request.method == "POST":
        app.logger.debug("POST registration")
        app.logger.debug(form.__dict__)
        if form.validate():
            app.logger.debug("form is VALID")
            existing_user = User.objects(email=form.email.data).first()
            if existing_user is None:
                hashpass = generate_password_hash(form.password.data, method="sha256")
                hey = User(email=form.email.data, password=hashpass).save()
                login_user(hey)
                app.logger.debug("22222 %s", hey)
                return redirect(url_for("dashboard"))
    app.logger.debug("GET registration")
    return render_template("register.html", form=form)


@app.route("/login", methods=["GET", "POST"])
def login():
    if current_user.is_authenticated == True:
        return redirect(url_for("dashboard"))
    form = RegistrationForm()
    if request.method == "POST":
        if form.validate():
            check_user = User.objects(email=form.email.data).first()
            if check_user:
                if check_password_hash(check_user["password"], form.password.data):
                    login_user(check_user)
                    return redirect(url_for("dashboard"))
    return render_template("login.html", form=form)


@app.route("/dashboard")
@login_required
def dashboard():
    return render_template("dashboard.html", name=current_user.email)


@app.route("/logout", methods=["GET"])
@login_required
def logout():
    logout_user()
    return redirect(url_for("login"))


# Create admin
admin = admin.Admin(app, index_view=MyHomeView(name="Home", url="/admin"))

# Add views
admin.add_view(IssuerInviteView(IssuerInvite))

# Start app
app.run()
