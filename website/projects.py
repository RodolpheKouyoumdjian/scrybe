from urllib import request
from flask import Blueprint, render_template, request, session, redirect, url_for
from firebase_admin import auth, db
from website.firebase_auth import check_if_user_is_logged_in

projects = Blueprint('projects', __name__)

@projects.route('/projects', methods=['POST', 'GET'])
def projectsBackend():
    print(session)
    try:
        if check_if_user_is_logged_in():
            userId = session['user']['localId']
            # Form submission
            projects_ref = db.reference(
                        f'users/{userId}/projects')
            if request.method == 'POST':
                
                button = request.form['button']

                # Create a new project, store to database
                if button == 'createProjectButton':
                    projectName = request.form['projectName']
                    projectDescription = request.form['projectDescription']

                    print('CREATEPROJECT')
                    print(projects_ref.get())

                    # Check if project already exists

                    # If projects have already been created
                    if projects_ref.get():
                        print('UHHHHH')

                        # Checking if project of the same name exists
                        if projectName not in projects_ref.get().keys():
                            print('NOTINYE')
                            ref = projects_ref.child(projectName)
                            ref.child('description').set(projectDescription)
                            ref.child('totalWordsGenerated').set(0)
                            ref.child('wordsThisMonth').set(0)
                            ref.child('totalImagesGenerated').set(0)
                            ref.child('imagesThisMonth').set(0)
                            return redirect(url_for('editor.editorBackend', projectName=projectName))
                    
                    # If no project has been created yet
                    else:
                        print('INSIDEYE')
                        ref = projects_ref.child(projectName)
                        ref.child('description').set(projectDescription)
                        ref.child('totalWordsGenerated').set(0)
                        ref.child('wordsThisMonth').set(0)
                        ref.child('totalImagesGenerated').set(0)
                        ref.child('imagesThisMonth').set(0)
                        return redirect(url_for('editor.editorBackend', projectName=projectName))

            # Default
            projects_ref = projects_ref.get()
            if projects_ref:
                names = list(projects_ref.keys())
                descriptions = [d['description'] for d in list(projects_ref.values())]
                twg = [d['totalWordsGenerated'] for d in list(projects_ref.values())]
                wtm = [d['wordsThisMonth'] for d in list(projects_ref.values())]
                tig = [d['totalImagesGenerated'] for d in list(projects_ref.values())]
                itm = [d['imagesThisMonth'] for d in list(projects_ref.values())]

                return render_template('projects.html', 
                                            projectNames=names, 
                                            projectDescriptions=descriptions,
                                            totalWordsGenerated=twg,
                                            wordsThisMonth=wtm,
                                            totalImagesGenerated=tig,
                                            imagesThisMonth=itm
                                            )
            return render_template('projects.html', projectNames=None, projectDescriptions=None)

            
        return redirect(url_for('authentication.login'))
    except KeyError:
        return redirect(url_for('authentication.login'))