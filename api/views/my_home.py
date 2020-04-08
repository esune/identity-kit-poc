import flask
from flask_admin import AdminIndexView, expose


class MyHomeView(AdminIndexView):
    @expose("/")
    def index(self):
        return self.render("admin/index.html")

    def is_accessible(self):
        if flask.g.oidc_id_token is not None:
            return True
        else:
            return flask.redirect(flask.url_for("login"))

    def is_visible(self):
        if flask.g.oidc_id_token is not None:
            return True
        else:
            return False
