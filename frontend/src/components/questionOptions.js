import { useContext } from 'react';
import './questionOptions.css'
import APIContext from '../api/APIContext';
import choose from '../data/choose.json';
import tag from '../data/tag.json'

const QuestionOptions = (props) => {
    const { AnswerAPI, selectedLanguage } = useContext(APIContext)
    const data = props.text

    function extractTag(str) {
        const match = str.trim().match(/^[A-Za-z]+/);
        if (match) {
            const startingAlphabet = match[0];
            return startingAlphabet.charAt(0).toUpperCase() + startingAlphabet.slice(1);
        } else {
            return "";
        }
    }
    return (
        <div className="bot-option-message">
            <div className='option-header'>{choose[selectedLanguage]}</div>
            <div className='option-container'>
                {data.map((ques) => (
                    <div key={ques.id} className='option-message' onClick={() => AnswerAPI(ques.id, ques.Ques)}>
                        {extractTag(ques.id)!=='' && <div className='option-message-tag'>{tag[extractTag(ques.id)][selectedLanguage]}</div>}
                        {ques.Ques}
                    </div>
                ))}
            </div>
        </div>

    );
}

export default QuestionOptions;
