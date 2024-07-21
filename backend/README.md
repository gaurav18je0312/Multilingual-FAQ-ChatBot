**FAQ Chatbot Backend with FastAPI, Marqo and Bhashini**

This backend service utilizes FastAPI for handling requests and Marqo for processing user queries to retrieve question IDs. 
Additionally, it integrates Bhashini for language translation functionalities.

**Endpoints:**

    /searchText/{lang_id}: POST request to search for text-based queries in the preferred language.
    /searchVoice/{lang_id}: POST request to search for voice-based queries in the preferred language.
    /answer/{lang_id}/{ques_id}: POST request to retrieve the answer for a specific question ID in the preferred language.
    /readText/{lang_id}/{ques_id}: POST request to retrieve a text-to-speech response for a specific question ID in the preferred language.

**Configuration**

FAQ Database: Ensure you have a JSON file containing FAQ data. Update the file_name variable in the code to point to your FAQ JSON file.

**API Endpoints**

    /searchText/{lang_id}:

        Method: POST
        Path Parameters:
            lang_id (str): Preferred language ID.
        body (dict): Request body containing the user's text query.
        Description: Searches for text-based queries in the preferred language and returns relevant questions.

    /searchVoice/{lang_id}:

        Method: POST
        Path Parameters:
            lang_id (str): Preferred language ID.
        body (dict): Request body containing the user's voice query in base64 format.
        Description: Searches for voice-based queries in the preferred language and returns relevant questions.
        
    /answer/{lang_id}/{ques_id}:

        Method: POST
        Path Parameters:
            lang_id (str): Preferred language ID.
            ques_id (str): Question ID for which the answer is requested.
        Description: Retrieves the answer for a specific question ID in the preferred language.

    /readText/{lang_id}/{ques_id}:

        Method: POST
        Path Parameters:
            lang_id (str): Preferred language ID.
            ques_id (str): Question ID for which the text-to-speech response is requested.
        Description: Retrieves a text-to-speech response for a specific question ID in the preferred language.

**OPENAI API KEY**

    First, add the key in the chat.py  