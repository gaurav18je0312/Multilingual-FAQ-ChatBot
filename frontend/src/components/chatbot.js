import React, { useState, useEffect, useContext, useRef } from "react";
import "./chatbot.css";
import QuestionOptions from "./questionOptions";
import VoiceChat from "./voice";
import LanguageSelect from "./languageSelect";
import APIContext from "../api/APIContext";
import gemLogo from "../data/gem-logo.png";
import chatbotLogo from "../data/chatbot-logo-removebg-preview.png";

const Chatbot = (props) => {
  const { messages, searchAPI, isLoading } = useContext(APIContext);
  const [inputValue, setInputValue] = useState("");
  const [audioPlay, setAudioPlay] = useState("");
  const [audio] = useState(new Audio());
  const messagesEndRef = useRef(null);
  const [openBot, setOpenBot] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const text = "Type your message here...";

  const handleOpenBot = () => {
    setOpenBot((prev) => !prev);
  };

  function renderMessage(text) {
    return { dangerouslySetInnerHTML: { __html: text } };
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim() === "") return;
    searchAPI(inputValue.trim());
    setInputValue("");
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const playAudio = (base64AudioString, index) => {
    setAudioPlay(index);
    const byteCharacters = atob(base64AudioString);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray.buffer], { type: "audio/mp3" }); // Adjust the type as needed

    audio.src = URL.createObjectURL(blob);

    audio.play();
  };

  const manageAudio = (base64AudioString, index) => {
    if (audioPlay === index) {
      setAudioPlay("");
      audio.pause();
      audio.currentTime = 0;
      audio.src = "";
    } else {
      playAudio(base64AudioString, index);
    }
  };

  useEffect(() => {
    setPlaceholder("");
    let currentIndex = 0;
    let currentText = "";
    const interval = setInterval(() => {
      currentText = currentText + text[currentIndex];
      currentIndex++;
      const tmp = currentText;
      setPlaceholder((prevPlaceholder) => tmp);
      if (currentIndex === text.length) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [openBot]);

  return (
    <>
      <div className={`chatbot-container ${openBot ? "show" : ""}`}>
        <div className="header">
          <div className="header-website">
            <div className="header-img">
              <div className="logo-container">
                <img src={chatbotLogo} width="80px" />
                <div class="green-circle"></div>
              </div>
            </div>
            <div className="header-title-conatiner">
              <div className="header-title">GeM Assistance</div>
              <div className="header-online">Online</div>
            </div>
          </div>
          <div className="setting-container">
            <LanguageSelect />
            <div className="close-btn" onClick={() => handleOpenBot()}>
              <i class="fa-solid fa-xmark fa-lg"></i>
            </div>
          </div>
        </div>
        <div className="messages-container">
          {messages.map((message, index) => (
            <React.Fragment key={index}>
              <div
                className={
                  message.isUser ? "current-time-user" : "current-time-bot"
                }>
                {message.isUser ? (
                  <div className="user-message-logo">You</div>
                ) : (
                  <div className="chatbot-message-logo">
                    <img src={chatbotLogo} width="20px" />{" "}
                    <div className="chatbot-message-title">Chatbot</div>
                  </div>
                )}
              </div>
              {message.haveOptions ? (
                <QuestionOptions text={message.text} />
              ) : (
                <div
                  key={index}
                  className={message.isUser ? "user-message" : "bot-message"}>
                  {message.isSpeak && (
                    <div
                      key={index}
                      className="audio-btn"
                      onClick={() => manageAudio(message.audio, index)}>
                      {audioPlay !== index ? (
                        <i class="fa-solid fa-volume-high fa-sm"></i>
                      ) : (
                        <i
                          className="fa-regular fa-circle-stop fa-sm"
                          style={{ color: "#C50809" }}></i>
                      )}
                    </div>
                  )}
                  <div {...renderMessage(message.text)} />
                </div>
              )}
              <div
                className={
                  message.isUser ? "current-time-user" : "current-time-bot"
                }>
                {message.time}
              </div>
              <div ref={messagesEndRef} />
            </React.Fragment>
          ))}
          {isLoading && (
            <div className="bot-message loading">
              <i class="fa-solid fa-circle fa-fade fa-2xs"></i>{" "}
              <i class="fa-solid fa-circle fa-fade fa-2xs"></i>{" "}
              <i class="fa-solid fa-circle fa-fade fa-2xs"> </i>
            </div>
          )}
        </div>
        <form onSubmit={handleSendMessage}>
          <div className="input-container">
            <input
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={handleInputChange}
            />
            <button type="submit">
              <i class="fa-solid fa-paper-plane fa-lg"></i>
            </button>
            <VoiceChat />
          </div>
        </form>
        <div className="beehyv-footer">
          Powered By <span className="bee">Bee</span>
          <span className="hyv">Hyv</span>
        </div>
      </div>

      <div
        className={`chatbot-logo ${openBot ? "" : "show"}`}
        onClick={() => handleOpenBot()}>
        <img src={chatbotLogo} />
      </div>
    </>
  );
};

export default Chatbot;
