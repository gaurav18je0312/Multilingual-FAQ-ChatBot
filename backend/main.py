from fastapi import FastAPI, Response
from bhashini import BhashiniAPI
from marqo_setup import MarqoSetup
import json
from fastapi.middleware.cors import CORSMiddleware
import os
import ffmpeg
import base64
import io
from chat import *
import redis
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
translator = BhashiniAPI(os.get("BHASHINI_USERID"), os.get("BHASHINI_API_KEY"))
mq = MarqoSetup()
folder_name = os.path.join(os.getcwd(), "data")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REDIS_HOST = os.environ.get("REDIS_HOST", "127.0.0.1")
REDIS_PORT = os.environ.get("REDIS_PORT", 6379)
REDIS_DB = os.environ.get("REDIS_DB", 0)
redis_store = redis.StrictRedis(
    host=REDIS_HOST, port=int(REDIS_PORT), db=int(REDIS_DB))

data = []

file_path = "language.json"
with open(file_path, 'r') as f:
    tmp = json.load(f)
    language_json = tmp["languages"]

try:
    files = os.listdir(folder_name)
    json_files = [file for file in files if file.endswith('.json')]
    for json_file in json_files:
        file_path = os.path.join(folder_name, json_file)
        with open(file_path, 'r') as f:
            tmp = json.load(f)
            tmp = tmp["FAQ"]
            data.extend(tmp)
except Exception as e:
    print(f'Error: {e}')
    raise


def encodeString(lst):
    result = ""
    for st in lst:
        if (st[0] != "<"):
            result += st
            result += "($)"
    return result[:-3]


def decodeString(st, arr):
    result = st.split("($)")
    i = 0
    ans = ""
    for st in arr:
        if (st[0] != "<"):
            ans += result[i]
            i += 1
        else:
            ans += st
    return ans


def translate(answer,lang_id, j):
    try:
        arr = decodeHTML(answer)
        answer = encodeString(arr)
        trans_ans = translator.translatorAPI(
            source_lang="en", txt=answer, target_lang=lang_id)
        trans_ans = decodeString(trans_ans, arr)
        return trans_ans
    except Exception as e:
        print(e)
        if (j > 0):
            j -= 1
            translate(answer, lang_id, j)


def webm_to_wav_base64(webm_base64):
   
    webm_bytes = base64.b64decode(webm_base64)

    webm_file = io.BytesIO(webm_bytes)

    # Convert WebM to WAV
    process = (
        ffmpeg
        .input('pipe:')
        .output('pipe:', format='wav')
        .run_async(pipe_stdin=True, pipe_stdout=True, pipe_stderr=True)
    )
    out, _ = process.communicate(input=webm_bytes)

    # Encode WAV to base64
    wav_base64 = base64.b64encode(out).decode('utf-8')

    return wav_base64


def decodeHTML(str):
    length = len(str)
    arr = []
    i = 0
    while (i < (length-1)):
        if str[i] == "<":
            tmp = str[i]
            while (i < (length-1) and str[i] != ">"):
                i += 1
                tmp += str[i]
            i += 1
            if (tmp.strip() == "<body>" or tmp.strip() == "<Body>"):
                arr = []

            arr.append(tmp.strip())
            if (tmp.strip() == "</body>" or tmp.strip() == "</Body>"):
                break
        else:
            tmp = str[i]
            while (i < (length-1) and str[i+1] != "<"):
                i += 1
                tmp += str[i]
            i += 1
            if (tmp.strip() != ""):
                arr.append(tmp)
    return arr

def multilineTranslator(lst, lang_id):
    txt = ''
    for ls in lst:
        txt += ls
        txt += '($)'
    
    response = translator.translatorAPI(source_lang="en", txt=txt[:-3], target_lang=lang_id)
    
    return response.split("($)")


@app.post("/searchText/{lang_id}/{session_id}")
async def searchText(lang_id: str, body: dict, session_id: str, response: Response):
    text = body["text"]
    if lang_id != "en":
        eng_text = translator.translatorAPI(
            source_lang=lang_id, txt=text, target_lang="en")
    else:
        eng_text = text
    ques_ids = mq.get_result(search_text=eng_text)
    messages = read_messages_from_redis(session_id, redis_store)
    result = []
    print(ques_ids)
    for ques_id in ques_ids:
        for ques in data:
            if ques["id"] == ques_id:
                result.append(ques["answer"])
    if lang_id!="en":
        result = multilineTranslator(result, lang_id)
    system_message = format_system_message(lang_id)
    for lang in language_json:
        if lang["id"]==lang_id:
            text+= f'(Reply in {lang["name"]} language)'
            break
    user_message = format_user_message(
        lang_id, text, result, max_tokens=2000
    )
    print(user_message)
    message_payload = create_message_payload(
        user_message, system_message, messages, max_tokens=2048
    )
    print(message_payload)
    answer = get_answer(messages=message_payload,
                        model="gpt-3.5-turbo", max_tokens=3024, temperature=0.7)
    answer = answer.replace("\n", "")
    answer = answer.replace("<h2", "<h3").replace("<h1", "<h3")
    answer = answer.replace("</h2>", "</h3>").replace("</h1", "</h3")

    # if lang_id != "en":
    #     j = 5
    #     trans_ans = translate(answer, lang_id, j)
    #     if (trans_ans is None):
    #         response.status_code = 404
    #         return {"Error": "Please try again!"}
    # else:
    #     arr = decodeHTML(answer)
    #     answer = ""
    #     for st in arr:
    #         answer += st
    #     trans_ans = answer
    assistant_message = format_assistant_message(answer)
    messages.extend([user_message, assistant_message])
    store_messages_in_redis(session_id, messages, redis_store)
    return {"Ans": answer}


@app.post("/searchVoice/{lang_id}")
async def searchVoice(lang_id: str, body: dict, response: Response):
    base64_audio = body["base64_audio"]
    base64_audio = webm_to_wav_base64(base64_audio)
    try:
        trans_result = translator.speechToTextAPI(
            source_lang=lang_id, base64_audio_content=base64_audio)
        if len(trans_result) == 0:
            response.status_code = 404
            return {"Error": "Please try again!"}
        body = {
            "text": trans_result
        }
        print(trans_result)
        return {"result": trans_result}
    except Exception as e:
        print(e)
        response.status_code = 404
        return {"Error": "language not supported"}


@app.post("/answer/{lang_id}/{ques_id}")
async def getAnswer(lang_id: str, ques_id: str, response: Response):
    for ques in data:
        if (ques["id"] == ques_id):
            result = ques["answer"]
            if lang_id != "en":
                trans_result = translator.translatorAPI(
                    source_lang="en", txt=result, target_lang=lang_id)
            else:
                trans_result = result
            return {"Ans": trans_result}

    response.status_code = 404
    return {"error": "Question not found"}


@app.post("/readText/{lang_id}")
async def readText(lang_id: str, body: dict, response: Response):
    text = body["text"]
    arr = decodeHTML(text)
    text = ""
    for st in arr:
        if (st[0] != "<"):
            text += st
    result = translator.textToSpeechAPI(source_lang=lang_id, txt=text)
    return {"base64_audio": result}


@app.post("/translate_word")
async def translate_word(word: str):
    translations = {}
    for lang_code in ["hi", "pa", "mr", "mai", "bn", "te", "gu", "ml", "ta", "kn", "or", "as", "ur", "brx", "ne", "sd", "sa", "sat", "mni", "doi", "ks"]:
        translation = translator.translatorAPI(
            source_lang="en", txt=word, target_lang=lang_code)
        translations[lang_code] = translation
    return translations
