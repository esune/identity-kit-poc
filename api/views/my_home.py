from flask_admin import AdminIndexView, expose

from ..api import oidc


class MyHomeView(AdminIndexView):
    @expose("/")
    def index(self):
        return self.render("admin/index.html")

    def is_accessible(self):
        return oidc.user_loggedin

    def is_visible(self):
        return oidc.user_loggedin
