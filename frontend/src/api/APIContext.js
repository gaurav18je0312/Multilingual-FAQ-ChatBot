import { createContext, useState } from "react";
import axios from "axios";
import assist from "../data/assist.json";
import pleaseType from "../data/pleasetype.json";
import { v4 as uuidv4 } from "uuid";

const APIContext = createContext();

export default APIContext;

const getCurrentTime = () => {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  const currentTime = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${amOrPm}`;
  return currentTime;
};

export const APIProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      text: assist["en"],
      isUser: false,
      haveOptions: false,
      isSpeak: false,
      time: getCurrentTime(),
    },
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [userID, setUserID] = useState(uuidv4());
  const [messagelen, setMessageLen] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    console.log(e.target.value);
    setMessageLen(0);
    setMessages([
      {
        text: assist[e.target.value],
        isUser: false,
        haveOptions: false,
        isSpeak: false,
        time: getCurrentTime(),
      },
    ]);
  };

  const searchAPI = (inputValue) => {
    setIsLoading(true);
    const updateMessage = [...messages];
    let len = messagelen;
    len++;
    updateMessage[len] = {
      text: inputValue,
      isUser: true,
      haveOptions: false,
      isSpeak: false,
      time: getCurrentTime(),
    };
    setMessages(updateMessage);
    const body = {
      text: inputValue,
    };
    function search() {
      axios
        .post(
          `http://localhost:8000/searchText/${selectedLanguage}/${userID}`,
          body
        )
        .then((response) => {
          console.log(response);
          const text = response.data.Ans;
          len++;
          setMessageLen(len);
          setIsLoading(false);
          const updateBotMessage = [...updateMessage];
          updateBotMessage[len] = {
            text: text,
            isUser: false,
            haveOptions: false,
            isSpeak: false,
            time: getCurrentTime(),
          };
          setMessages(updateBotMessage);
          getAudio(len, text, updateMessage);
        })
        .catch((error) => {
          console.log(error);
          const text = "Sorry, we are unavailable for now.";
          len++;
          setMessageLen(len);
          setIsLoading(false);
          setMessages((prev) => [
            ...prev,
            {
              text: text,
              isUser: false,
              haveOptions: false,
              isSpeak: false,
              time: getCurrentTime(),
            },
          ]);
        });
    }
    search();
  };

  const getAudio = (ind, text, updateMessage) => {
    const body = {
      text: text,
    };
    axios
      .post(`http://localhost:8000/readText/${selectedLanguage}`, body)
      .then((response) => {
        const audio = response.data.base64_audio;
        console.log("updateMessage", updateMessage);
        updateMessage[ind] = {
          text: text,
          isUser: false,
          haveOptions: false,
          isSpeak: true,
          audio: audio,
          time: getCurrentTime(),
        };
        console.log("updateMessage", updateMessage);
        setMessages(updateMessage);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchVoiceAPI = (base64_audio) => {
    console.log();
    const body = {
      base64_audio: base64_audio,
    };
    axios
      .post(`http://localhost:8000/searchVoice/${selectedLanguage}`, body)
      .then((response) => {
        console.log(response);
        const text = response.data.result;
        searchAPI(text);
      })
      .catch((error) => {
        console.log(error);
        const text = pleaseType[selectedLanguage];
        const len = messagelen;
        len++;
        setMessageLen(len);
        setMessages((prev) => [
          ...prev,
          {
            text: text,
            isUser: false,
            haveOptions: false,
            isSpeak: false,
            time: getCurrentTime(),
          },
        ]);
      });
  };

  let data = {
    messages: messages,
    selectedLanguage: selectedLanguage,
    handleLanguageChange: handleLanguageChange,
    searchAPI: searchAPI,
    searchVoiceAPI: searchVoiceAPI,
    isLoading: isLoading,
  };

  return <APIContext.Provider value={data}>{children}</APIContext.Provider>;
};
