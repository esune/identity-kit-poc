from flask_login import UserMixin
from flask_mongoengine import Document, MongoEngine


class User(UserMixin, Document):
    meta = {"collection": "registered_users"}
    email = MongoEngine().StringField()
    password = MongoEngine().StringField()
