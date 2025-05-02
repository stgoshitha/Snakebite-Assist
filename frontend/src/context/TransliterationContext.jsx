import React, { createContext, useState, useContext } from 'react';

// Basic Sinhala transliteration mapping for common characters
const transliterationMap = {
  // Words and common phrases (process these first)
  'amma': 'අම්මා',
  'appa': 'අප්පා',
  'ayya': 'අය්යා',
  
  // Consonant combinations with vowels
  'kaa': 'කා', 'ki': 'කි', 'kee': 'කී', 'ku': 'කු', 'kuu': 'කූ', 'ke': 'කෙ', 'kae': 'කැ', 'kai': 'කෛ', 'ko': 'කො', 'kau': 'කෞ',
  'gaa': 'ගා', 'gi': 'ගි', 'gee': 'ගී', 'gu': 'ගු', 'guu': 'ගූ', 'ge': 'ගෙ', 'gae': 'ගැ', 'gai': 'ගෛ', 'go': 'ගො', 'gau': 'ගෞ',
  'taa': 'ටා', 'ti': 'ටි', 'tee': 'ටී', 'tu': 'ටු', 'tuu': 'ටූ', 'te': 'ටෙ', 'tae': 'ටැ', 'tai': 'ටෛ', 'to': 'ටො', 'tau': 'ටෞ',
  'daa': 'දා', 'di': 'දි', 'dee': 'දී', 'du': 'දු', 'duu': 'දූ', 'de': 'දෙ', 'dae': 'දැ', 'dai': 'දෛ', 'do': 'දො', 'dau': 'දෞ',
  'naa': 'නා', 'ni': 'නි', 'nee': 'නී', 'nu': 'නු', 'nuu': 'නූ', 'ne': 'නෙ', 'nae': 'නැ', 'nai': 'නෛ', 'no': 'නො', 'nau': 'නෞ',
  'paa': 'පා', 'pi': 'පි', 'pee': 'පී', 'pu': 'පු', 'puu': 'පූ', 'pe': 'පෙ', 'pae': 'පැ', 'pai': 'පෛ', 'po': 'පො', 'pau': 'පෞ',
  'baa': 'බා', 'bi': 'බි', 'bee': 'බී', 'bu': 'බු', 'buu': 'බූ', 'be': 'බෙ', 'bae': 'බැ', 'bai': 'බෛ', 'bo': 'බො', 'bau': 'බෞ',
  'maa': 'මා', 'mi': 'මි', 'mee': 'මී', 'mu': 'මු', 'muu': 'මූ', 'me': 'මෙ', 'mae': 'මැ', 'mai': 'මෛ', 'mo': 'මො', 'mau': 'මෞ',
  'yaa': 'යා', 'yi': 'යි', 'yee': 'යී', 'yu': 'යු', 'yuu': 'යූ', 'ye': 'යෙ', 'yae': 'යැ', 'yai': 'යෛ', 'yo': 'යො', 'yau': 'යෞ',
  'raa': 'රා', 'ri': 'රි', 'ree': 'රී', 'ru': 'රු', 'ruu': 'රූ', 're': 'රෙ', 'rae': 'රැ', 'rai': 'රෛ', 'ro': 'රො', 'rau': 'රෞ',
  'laa': 'ලා', 'li': 'ලි', 'lee': 'ලී', 'lu': 'ලු', 'luu': 'ලූ', 'le': 'ලෙ', 'lae': 'ලැ', 'lai': 'ලෛ', 'lo': 'ලො', 'lau': 'ලෞ',
  'waa': 'වා', 'wi': 'වි', 'wee': 'වී', 'wu': 'වු', 'wuu': 'වූ', 'we': 'වෙ', 'wae': 'වැ', 'wai': 'වෛ', 'wo': 'වො', 'wau': 'වෞ',
  'saa': 'සා', 'si': 'සි', 'see': 'සී', 'su': 'සු', 'suu': 'සූ', 'se': 'සෙ', 'sae': 'සැ', 'sai': 'සෛ', 'so': 'සො', 'sau': 'සෞ',
  'haa': 'හා', 'hi': 'හි', 'hee': 'හී', 'hu': 'හු', 'huu': 'හූ', 'he': 'හෙ', 'hae': 'හැ', 'hai': 'හෛ', 'ho': 'හො', 'hau': 'හෞ',
  
  // Basic consonants
  'ka': 'ක', 'ga': 'ග', 'Ta': 'ට', 'Da': 'ඩ', 'Na': 'ණ',  
  'ta': 'ත', 'da': 'ද', 'na': 'න', 'pa': 'ප', 'ba': 'බ',
  'ma': 'ම', 'ya': 'ය', 'ra': 'ර', 'la': 'ල', 'va': 'ව',
  'wa': 'ව', 'sa': 'ස', 'ha': 'හ', 'La': 'ළ', 'fa': 'ෆ',
  
  // Pure consonants (with hal)
  'k': 'ක්', 'g': 'ග්', 't': 'ත්', 'd': 'ද්', 'n': 'න්',
  'p': 'ප්', 'b': 'බ්', 'm': 'ම්', 'y': 'ය්', 'r': 'ර්',
  'l': 'ල්', 'v': 'ව්', 'w': 'ව්', 's': 'ස්', 'h': 'හ්',
  'f': 'ෆ්',
  
  // Vowels
  'a': 'අ', 'aa': 'ආ', 'ae': 'ඇ', 'aae': 'ඈ',
  'i': 'ඉ', 'ii': 'ඊ', 'u': 'උ', 'uu': 'ඌ',
  'e': 'එ', 'ee': 'ඒ', 'ai': 'ඓ',
  'o': 'ඔ', 'oo': 'ඕ', 'au': 'ඖ',
};

const TransliterationContext = createContext();

export const useTransliteration = () => useContext(TransliterationContext);

export const TransliterationProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false);

  // Sort the mapping keys by length (longest first) to ensure proper matching
  const sortedKeys = Object.keys(transliterationMap).sort((a, b) => b.length - a.length);

  // Improved transliterate function
  const transliterate = (text) => {
    if (!isEnabled || !text) return text;
    
    let result = text;
    let position = 0;
    let output = '';
    
    // Process the input text by looking for matches
    while (position < result.length) {
      let matched = false;
      
      // Try to match the longest patterns first
      for (const pattern of sortedKeys) {
        const remainingText = result.substr(position);
        if (remainingText.startsWith(pattern)) {
          output += transliterationMap[pattern];
          position += pattern.length;
          matched = true;
          break;
        }
      }
      
      // If no match is found, keep the original character
      if (!matched) {
        output += result.charAt(position);
        position++;
      }
    }
    
    return output;
  };

  // Toggle transliteration on/off
  const toggleTransliteration = () => {
    setIsEnabled(!isEnabled);
  };

  return (
    <TransliterationContext.Provider value={{ 
      isEnabled, 
      toggleTransliteration,
      transliterate
    }}>
      {children}
    </TransliterationContext.Provider>
  );
}; 