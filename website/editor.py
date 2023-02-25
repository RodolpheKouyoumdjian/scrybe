from cgi import test
import json
from flask import Blueprint, render_template, request, redirect, url_for, session
from website.aiWriters import *
from website.authentication import check_if_user_is_logged_in
from firebase_admin import db

editor = Blueprint('editor', __name__)

@editor.route('/editor', methods=['POST', 'GET'])
def editorBackend():
    try:
        if check_if_user_is_logged_in():
            projectName = request.args['projectName']

            return render_template('editor.html', projectName=projectName)
        return redirect(url_for('authentication.login'))
    except KeyError:
        return redirect(url_for('authentication.login'))

@editor.route('/_getDataOnEditorInit', methods=['POST', 'GET'])
def _getDataOnEditorInit():
    print('DEDANS')
    projectName = request.form['projectName']
    userId = session['user']['localId']
    ref = db.reference(f'users/{userId}/projects/{projectName}/editorData')
    if ref:
        return ref.get() 
    return None       
        


