from flask import Blueprint, render_template, request, redirect, url_for, jsonify
from website.aiWriters import *
views = Blueprint('views', __name__)

@views.route('/', methods=['POST', 'GET'])
def home():
    if request.method == 'POST':
        button = request.form['button']
        if button == 'go_to_sign_in':
            return redirect(url_for('authentication.login'))

        elif button == 'go_to_sign_up':
            return redirect(url_for('authentication.sign_up'))

        elif button == 'go_to_editor':
            return redirect(url_for('editor.editorBackend'))

    return render_template('home.html')