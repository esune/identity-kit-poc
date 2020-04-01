import datetime
import json

from flask_admin.contrib.mongoengine import ModelView

from widgets.surveyjs import SurveyJSField


class IssuerInviteView(ModelView):
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
        if is_created:
            pass
            # TODO: set user
        else:
            # TODO: set user
            model.updated_at = datetime.datetime.utcnow
        
        # deserialize data object and store it
        model.data = json.loads(model.data)
