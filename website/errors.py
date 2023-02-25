from flask import render_template, Blueprint

errors = Blueprint('errors', __name__)

@errors.app_errorhandler(404)
def page_not_found(error):
    return render_template('404.html'), 404
