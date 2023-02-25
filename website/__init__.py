from flask import Flask
from .views import views
from .authentication import authentication
from .editor import editor
from .aiWriters import aiWriters
from .projects import projects
from .errors import errors

def create_app():
    app = Flask(__name__)

    # This is an encryption key to secure the cookies
    # saved for the current session
    app.config['SECRET_KEY'] = 'MY_SECRET_KEY'
    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(authentication, url_prefix='/')
    app.register_blueprint(editor, url_prefix='/')
    app.register_blueprint(aiWriters, url_prefix='/')
    app.register_blueprint(projects, url_prefix='/')
    app.register_blueprint(errors, url_prefix='/')
    
    return app
