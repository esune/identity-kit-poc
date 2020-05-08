from flask import redirect, render_template, url_for

from app.auth import bp
from app.auth.oidc import auth


@bp.route("/logout")
@auth.oidc_logout
def logout():
    return redirect(url_for("admin.index"))


@bp.route("/unauthorized")
@auth.oidc_logout
def unauthorized():
    return render_template("auth/unauthorized.html")
