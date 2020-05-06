from flask import redirect, url_for
from flask_admin import AdminIndexView, expose
from flask_login import login_required, logout_user


class MyHomeView(AdminIndexView):
    @expose("/")
    @login_required
    def index(self):
        return super(MyHomeView, self).index()

    @expose("/logout/")
    def logout_view(self):
        logout_user()
        return redirect(url_for(".index"))
