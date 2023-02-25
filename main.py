from website import create_app
from firebase_admin import credentials, initialize_app

# Firebase initializer, replace the CONFIG/firebase_config.json
# values with your own database for testing 

cred = credentials.Certificate("CONFIG/firebase_config.json")
initialize_app(
    cred, {
        'databaseURL': "https://moneymovestesting-default-rtdb.firebaseio.com"
    }
)

# DO NOT MODIFY ANYTHING UNDER THIS
# This code initializes the app
# Creates the flask app
app = create_app()

# Runs the app
if __name__ == "__main__":
    app.run(debug=True)
