from firebase_admin import db
import openai
from flask import Blueprint, request, session
import string

aiWriters = Blueprint('aiWriters', __name__)

API_KEY = "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"
openai.api_key = API_KEY


@aiWriters.route('/_emailWriter', methods=['POST'])
def _emailWriter():
    type = request.form['emailType']
    content = request.form['emailContent']
    tone = request.form['emailTone']

    if type != '' and content != '' and tone != '':
        prompt = f'Write a {type} email with a {tone} tone containing this information: {content}'
        completion = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.9,
            max_tokens=2048,
            top_p=0.1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=["\"\"\""]
        )

        text = completion['choices'][0]['text']
        _firebaseWordCounter(output=text, projectName=request.form['projectName'])
        return text
    return ''
    


@aiWriters.route('/_socialMediaWriter', methods=['POST'])
def _socialMediaWriter():
    
    platform = request.form['socialMediaPlatform']
    type = request.form['socialMediaType']
    content = request.form['socialMediaContent']
    tone = request.form['socialMediaTone']

    if platform.replace(' ', '') != '' and type.replace(' ', '') != '' and content.replace(' ', '') != '' and tone.replace(' ', '') != '':
        prompt = f'Write a {platform} {type} with a {tone} tone containing this information: {content}'
        completion = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.9,
            max_tokens=2048,
            top_p=0.1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=["\"\"\""]
        )

        text = completion['choices'][0]['text']
        _firebaseWordCounter(output=text, projectName=request.form['projectName'])
        return text
    return ''


@aiWriters.route('/_articleWriter', methods=['POST'])
def _articleWriter():
    type = request.form['articleType']
    content = request.form['articleContent']
    tone = request.form['articleTone']

    if type.replace(' ', '') != '' and content.replace(' ', '') != '' and tone.replace(' ', '') != '':
        prompt = f'Write an article {type} with a {tone} tone containing this information: {content}'
        completion = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.9,
            max_tokens=2048,
            top_p=0.1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=["\"\"\""]
        )

        text = completion['choices'][0]['text']
        _firebaseWordCounter(output=text, projectName=request.form['projectName'])
        return text
    return ''


@aiWriters.route('/_customWriter', methods=['POST'])
def _customWriter():
    prompt = request.form['customInput']
    if prompt.replace(' ', '') != '':
        completion = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.9,
            max_tokens=2048,
            top_p=0.1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=["\"\"\""]
        )

        text = completion['choices'][0]['text']
        _firebaseWordCounter(output=text, projectName=request.form['projectName'])
        return text
    return ''


@aiWriters.route('/_imageGenerator', methods=['POST'])
def _imageGenerator():
    userId = session['user']['localId']

    prompt = request.form['imageInput']

    if prompt.replace(' ', '') != '':
        response = openai.Image.create(
            prompt=prompt,
            n=1,
            size="1024x1024"
        )

        image_url = response['data'][0]['url']

        ref = db.reference('users/{userId}/projects/{projectName}/totalImagesGenerated')
        # newImagesGeneratedCount = ref.get() + 1
        # ref.set(newImagesGeneratedCount)

        return image_url
    return ''


@aiWriters.route('/_lengthenText', methods=['POST', 'GET'])
def _lengthenText():
    textToModify = request.form['textToModify']
    prompt = f'Lengthen this text: {textToModify}'

    if textToModify.replace(' ', '') != '':
        completion = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.9,
            max_tokens=2048,
            top_p=0.1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=["\"\"\""]
        )

        text = completion['choices'][0]['text']
        _firebaseWordCounter(output=text, projectName=request.form['projectName'])
        return text
    return ''

@aiWriters.route('/_summarizeText', methods=['POST'])
def _summarizeText():
    textToModify = request.form['textToModify']
    prompt = f'Summarize this text: {textToModify}'

    if textToModify.replace(' ', '') != '':
        completion = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.9,
            max_tokens=2048,
            top_p=0.1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=["\"\"\""]
        )

        text = completion['choices'][0]['text']
        _firebaseWordCounter(output=text, projectName=request.form['projectName'])
        return text
    return ''

@aiWriters.route('/_rephraseText', methods=['POST'])
def _rephraseText():
    textToModify = request.form['textToModify']
    prompt = f'Rephrase this text differently: {textToModify}'

    if textToModify.replace(' ', '') != '':
        completion = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            temperature=0.9,
            max_tokens=2048,
            top_p=0.1,
            frequency_penalty=0,
            presence_penalty=0,
            stop=["\"\"\""]
        )

        text = completion['choices'][0]['text']
        _firebaseWordCounter(output=text, projectName=request.form['projectName'])
        return text
    return ''

def _firebaseWordCounter(output, projectName):
    userId = session['user']['localId']
    translator = str.maketrans("", "", string.punctuation)
    outputLength = len(output.translate(translator).split(' '))

    ref = db.reference(f'users/{userId}/projects/{projectName}/totalWordsGenerated')
    newLength = ref.get() + outputLength
    ref.set(newLength)