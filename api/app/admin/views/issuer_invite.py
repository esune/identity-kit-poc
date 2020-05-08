import datetime
import json

from flask import session
from flask_admin import BaseView
from flask_admin.contrib.mongoengine import ModelView

from ..widgets.surveyjs import SurveyJSField


class IssuerInviteView(ModelView, BaseView):
    column_list = ("email", "issued", "expired")
    form_widget_args = {
        "token": {"disabled": True},
        "created_at": {"disabled": True},
        "created_by": {"disabled": True},
        "updated_at": {"disabled": True},
        "updated_by": {"disabled": True},
    }

    form_overrides = {"data": SurveyJSField}

    def on_model_change(self, form, model, is_created):
        if "userinfo" not in session:
            raise Exception

        logged_user = session["userinfo"]["preferred_username"]
        if is_created:
            model.created_by = logged_user
        else:
            model.updated_by = logged_user
            model.updated_at = datetime.datetime.utcnow

        # deserialize data object and store it
        model.data = json.loads(model.data)
