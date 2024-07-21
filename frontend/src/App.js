import './App.css';
import { APIProvider } from './api/APIContext';
import Chatbot from './components/chatbot'


function App() {
  
  return (
    <>
        <APIProvider>
          <Chatbot />
        </APIProvider>
        
    </>
  );
}

export default App;
