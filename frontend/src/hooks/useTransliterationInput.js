import { useRef, useState } from 'react';
import { useTransliteration } from '../context/TransliterationContext';

/**
 * Custom hook for managing transliteration on input fields
 * 
 * @returns {Object} - Input props and handlers for transliteration
 */
export const useTransliterationInput = () => {
  const [inputValue, setInputValue] = useState('');
  const { isEnabled, transliterate } = useTransliteration();
  
  // Handle input change with transliteration
  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    // If transliteration is enabled, we'll display the transliterated text
    // but keep the original value for editing
    if (isEnabled) {
      // The actual transliteration happens in the display, not in the stored value
      e.target.transliteratedValue = transliterate(value);
    }
  };
  
  // Get props to spread on an input
  const getInputProps = () => ({
    value: inputValue,
    onChange: handleChange,
    className: isEnabled ? 'transliteration-enabled' : ''
  });
  
  return {
    inputValue,
    setInputValue,
    handleChange,
    getInputProps
  };
};

export default useTransliterationInput; 