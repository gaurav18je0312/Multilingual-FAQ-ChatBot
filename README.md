# Multilingual FAQ Chatbot

This project is a multilingual FAQ chatbot designed to answer frequently asked questions in 22 Indian languages. The chatbot is built with a React.js frontend and a FastAPI backend.

## Features

- Multilingual support for 22 Indian languages
- Intelligent response generation for FAQs using OpenAI's generative AI models
- Efficient and accurate FAQ retrieval using Marqo's vector search engine
- Speech-to-text, text-to-speech, and translation capabilities using Bhashini
- Personalized user interactions with Redis for managing user context and history
- Responsive user interface

## Technologies Used

- **Frontend:** React.js
- **Backend:** FastAPI, Python
- **FAQ Retrieval:** Marqo's vector search engine
- **Generative AI:** OpenAI
- **Speech and Translation:** Bhashini
- **State Management:** Redis
- **Real-time Communication:** WebSockets

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- npm
- Python
- Uvicorn
- Redis
- Marqo (for setup, follow the instructions [here](https://docs.marqo.ai/2.10/))

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/gaurav18je0312/multilingual-faq-chatbot.git
    cd multilingual-faq-chatbot
    ```

2. Create a `.env` file in the `backend` directory with the following content:

    ```dotenv
    OPENAI_API_KEY=your_openai_api_key
    BHASHINI_USERID=your_bhashini_userid
    BHASHINI_API_KEY=your_bhashini_api_key
    ```

3. Set up and run the backend:

    ```bash
    cd backend
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```

4. Set up and run the frontend:

    ```bash
    cd ../frontend
    npm install
    npm start
    ```

5. Start Redis (if not already running):

    ```bash
    redis-server
    ```

6. Access the application:

    - Frontend: `http://localhost:3000`
    - Backend: `http://localhost:8000`

## Project Structure

- **frontend/**: Contains the React.js frontend code
- **backend/**: Contains the FastAPI backend code
- **backend/data/**: Contains the FAQ file in JSON format

## Usage

### Frontend

The frontend is built using React.js and provides an interactive user interface for users to ask questions and receive answers in multiple languages.

### Backend

The backend is built using FastAPI and handles the chatbot's logic, including processing user inputs, generating responses, supporting multilingual capabilities, and managing user context and history.

### FAQ Data

The FAQ data is stored in JSON format in the `backend/data/` directory.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Uvicorn](https://www.uvicorn.org/)
- [OpenAI](https://openai.com/)
- [Marqo](https://marqo.ai/)
- [Bhashini](https://bhashini.gov.in/)
- [Redis](https://redis.io/)
- [Node.js](https://nodejs.org/)
