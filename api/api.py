import flask_admin as admin
from flask import Flask
from flask_mongoengine import MongoEngine

from models.issuer_invite import IssuerInvite
from views.issuer_invite import IssuerInviteView

# Create application
app = Flask(__name__)

# Create dummy secrey key so we can use sessions
app.config["SECRET_KEY"] = "123456790"
app.config["MONGODB_SETTINGS"] = {"db": "issuer"}

# Create models
db = MongoEngine()
db.init_app(app)


# Flask views
@app.route("/")
def index():
    return '<a href="/admin/">Click me to get to Admin!</a>'


if __name__ == "__main__":
    # Create admin
    admin = admin.Admin(app, "Issuer Admin")

    # Add views
    admin.add_view(IssuerInviteView(IssuerInvite))

    # Start app
    app.run(debug=True)
