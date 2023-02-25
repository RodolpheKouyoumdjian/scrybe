from flask import Blueprint, render_template, request, redirect, url_for, session
from firebase_admin import auth, db
from website.firebase_auth import *

authentication = Blueprint('authentication', __name__)


@authentication.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        try:
            email = request.form['email']
            password = request.form['password']
            sign_in_with_email_and_password(
                email=email, password=password)

            user = User(auth.get_user_by_email(email))
            pricing_plan = db.reference('users').child(
                user.uid()).child('pricing_plan').get()

            session['logged_in'] = True
            session['user'] = user.to_dict()
            session['pricing_plan'] = pricing_plan

            return redirect(url_for('projects.projectsBackend'))
            
        except Exception as e:
            print(e)

    return render_template('login.html')


@authentication.route('/signup', methods=['POST', 'GET'])
def sign_up():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        full_name = request.form['full_name']

        # Check if any of the fields are empty
        if not email or not password or not full_name:
            print('Please fill out all the fields')
            return redirect(url_for('authentication.sign_up'))

        try:
            user = User(create_user_with_email_and_password(
                email=email,
                password=password,
                fullName=full_name
            ))
            session['logged_in'] = True
            session['user'] = user.to_dict()

            # Save account type and name to Firebase
            database = db.reference("users")

            # Get ref to the user
            user_ref = database.child(user.uid())

            # Create a child node which contains the pricing plan
            user_ref.child('pricing_plan').set('normal_plan')

            return redirect((url_for('projects.projectsBackend')))

            
        except Exception as e:
            print(e)
            return redirect(url_for('authentication.signup'))
    return render_template('sign_up.html')