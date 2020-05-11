from flask import redirect, render_template, url_for

from app import auth
from app.auth import bp


@bp.route("/logout")
@auth.oidc_logout
def logout():
    return redirect(url_for("admin.index"))


@bp.route("/unauthorized")
@auth.oidc_logout
def unauthorized():
    return render_template("auth/unauthorized.html")
