// import { ReactMic } from 'react-mic';
// import React from 'react';
// import { WavRecorder } from "webm-to-wav-converter";

// export class Example extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       record: false
//     }
//   }
 
  

// // or const { WavRecorder } = require("webm-to-wav-converter");

//     const wavRecorder = new WavRecorder();

//     // To start recording
//     wavRecorder.start();

//     // To stop recording
//     wavRecorder.stop();

//     // To get the wav Blob in 16-bit encoding and defualt sample rate
//     wavRecorder.getBlob();

//     // To get the wav Blob in 32-bit encoding
//     wavRecorder.getBlob(true);

// // To get the wav Blob in 32-bit encoding with AudioContext options
//     wavRecorder.getBlob(true, { sampleRate:  96000 });

//     // To download the wav file in 32-bit encoding with AudioContext options

 
//   render() {
//     return (
//       <div>
//         <ReactMic
//           record={this.state.record}
//           className="sound-wave"
//           onStop={this.onStop}
//           strokeColor="#000000"
//           backgroundColor="#FF4081" />
//         <button onClick={this.startRecording} type="button">Start</button>
//         <button onClick={this.stopRecording} type="button">Stop</button>
//       </div>
//     );
//   }
// }