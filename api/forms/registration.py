from flask_wtf import FlaskForm
from wtforms import PasswordField, StringField
from wtforms.validators import Email, InputRequired, Length


class RegistrationForm(FlaskForm):
    email = StringField(
        "email",
        validators=[InputRequired(), Email(message="Invalid email"), Length(max=30)],
    )
    password = PasswordField(
        "password", validators=[InputRequired(message="Invalid password"), Length(min=3, max=20)]
    )
