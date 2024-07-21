import React, { useContext, useState } from 'react';
import './languageSelect.css'
import jsonData from '../data/language.json'
import APIContext from '../api/APIContext';

const LanguageSelect = () => {

    const {selectedLanguage, handleLanguageChange} = useContext(APIContext)
    const lang = jsonData.languages

    return (
        <div className="language-dropdown">
            <select id="language-select" value={selectedLanguage} onChange={handleLanguageChange} className="select-language">
                {lang.map(la => (<option key={la.id} value={la.id}>{la.name}</option>))}
            </select>
        </div>
    );
};

export default LanguageSelect;
