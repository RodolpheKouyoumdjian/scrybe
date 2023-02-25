from firebase_admin import auth
from flask import session, redirect, url_for
import requests
import json

FIREBASE_WEB_API_KEY = 'AIzaSyDZMYYnNxKjKeNQO5_B2-T5Z_1NU7JSGS8'
rest_api_url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword"


def create_user_with_email_and_password(email: str, password: str, fullName=''):
    try:
        if fullName == '':
            return auth.create_user(
                email=email,
                password=password
            )
        else:
            return auth.create_user(
                email=email,
                password=password,
                display_name=fullName
            )
    except:
        raise(auth.EmailAlreadyExistsError)


def sign_in_with_email_and_password(email: str, password: str, return_secure_token: bool = True):
    try:
        payload = json.dumps({
            "email": email,
            "password": password,
            "returnSecureToken": return_secure_token
        })

        r = requests.post(rest_api_url,
                        params={"key": FIREBASE_WEB_API_KEY},
                        data=payload)
        r = r.json()
        try:
            if r['kind'] == 'identitytoolkit#VerifyPasswordResponse':
                if r['email'] == email:
                    if r['registered'] == True:
                        return r
        except:
            raise Exception('Sign In Failed')

    except:
        raise Exception('Sign In Failed')

def check_if_user_is_logged_in():
    return session['logged_in'] and session['user'] != None

class User():
    def __init__(self, user):
        self.user = user

    def to_dict(self):
        return vars(vars(self)['user'])['_data']

    def email(self):
        print(self.to_dict()['email'])
        return self.to_dict()['email']

    def uid(self):
        print(self.to_dict()['email'])
        return self.to_dict()['localId']