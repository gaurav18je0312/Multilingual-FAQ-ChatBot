import React, { useContext, useState, useEffect } from 'react';
import APIContext from '../api/APIContext';

const VoiceChat = () => {
  const {searchVoiceAPI} = useContext(APIContext)
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  useEffect(() => {
    if (audioChunks.length > 0){
      console.log(audioChunks.length)
      const audioChunk = audioChunks[audioChunks.length - 1]
      const audioBlob = new Blob([audioChunk], { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1]; // Get base64 data excluding header
      console.log(reader.result)
      if (base64Data==='') {
        return
      }
      else{
        searchVoiceAPI(base64Data)
      }
      
    }
    reader.readAsDataURL(audioBlob)
  }}, [audioChunks])

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          setAudioChunks(prev => [...prev, e.data]);
        };
        recorder.start();
        setRecording(true);
        setMediaRecorder(recorder);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        // Handle error
      });
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      setRecording(false);
      console.log(audioChunks)
    };
    }

  return (
    <>
      <div className= "mic-container" onClick={recording ? stopRecording : startRecording}>
        {recording ? <i className="fa-solid fa-stop fa-lg" style={{color: "#07222E"}}></i> : <i className="fa-solid fa-microphone fa-lg"></i>}
    </div>
    </>
  );
};
export default VoiceChat;
