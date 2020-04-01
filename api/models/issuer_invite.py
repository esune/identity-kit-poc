import datetime
import uuid

from flask_mongoengine import MongoEngine


class IssuerInvite(MongoEngine().Document):
    token = MongoEngine().StringField(max_length=36, default=lambda: str(uuid.uuid4()))
    email = MongoEngine().EmailField(required=True)

    issued = MongoEngine().BooleanField(default=False)
    expired = MongoEngine().BooleanField(default=False)

    created_at = MongoEngine().DateTimeField(default=datetime.datetime.utcnow)
    created_by = MongoEngine().StringField(max_length=50)

    updated_at = MongoEngine().DateTimeField()
    updated_by = MongoEngine().StringField(max_length=50)

    data = MongoEngine().DynamicField()

    def __unicode__(self):
        return self.email
