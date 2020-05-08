import json
import os

from flask import current_app, render_template
from wtforms import Field
from wtforms.widgets import HTMLString, Input
from wtforms.widgets.core import html_params


def read_survey_config(name):
    filename = os.path.join(current_app.root_path, "config", name)
    with open(filename) as config:
        return json.load(config)


class SurveyJSWidget(Input):
    html_params = staticmethod(html_params)

    def __call__(self, field, **kwargs):
        kwargs.setdefault("id", field.id)
        kwargs.setdefault("type", self.input_type)
        if "value" not in kwargs:
            kwargs["value"] = json.dumps(field.data)
        inputHTML = HTMLString(
            "<input %s>"
            % self.html_params(
                name=field.name, readonly=True, style="display:none;", **kwargs
            )
        )

        survey_config = read_survey_config("claim-config.json")
        return render_template(
            "survey.html",
            context={
                "field_id": field.id,
                "survey_config": json.dumps(survey_config),
                "inputHTML": inputHTML,
            },
        )


class SurveyJSField(Field):
    widget = SurveyJSWidget(input_type="text")

    def __init__(self, label=None, validators=None, text="SurveyJS", **kwargs):
        super(SurveyJSField, self).__init__(label, validators, **kwargs)
