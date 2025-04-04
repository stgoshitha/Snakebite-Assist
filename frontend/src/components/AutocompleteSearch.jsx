import React, { useState, useEffect } from "react";
import { MdOutlineSettingsVoice } from "react-icons/md";
import { MdSettingsVoice } from "react-icons/md";

const AutocompleteSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSnake, setSelectedSnake] = useState(null);
  const [isListening, setIsListening] = useState(false);

  let debounceTimeout;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  const handleSearch = async (event) => {
    const value = event.target.value;
    setKeyword(value);
    setError(null);
    setSelectedSnake(null); // Reset selected snake when searching

    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(async () => {
      if (value.length > 0) {
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:3000/api/search/search?keyword=${value}`
          );

          if (response.ok) {
            const data = await response.json();
            console.log("Search Results:", data);
            setSuggestions(data.data || []);
          } else {
            setSuggestions([]);
            setError("No results found.");
          }
        } catch (err) {
          console.error("Error during search:", err);
          setSuggestions([]);
          setError("Error fetching search results");
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSelectSnake = (snake) => {
    setSelectedSnake(snake);
    setKeyword(""); // Clear input after selection
    setSuggestions([]);
  };

  const renderSuggestions = () => {
    if (loading) return <div className="p-2 text-gray-500">Loading...</div>;
    if (error) return <div className="p-2 text-red-500">{error}</div>;
    if (suggestions.length === 0 && keyword.length > 0)
      return <div className="p-2 text-gray-500">No suggestions found</div>;
    return (
      <ul className="max-h-60 overflow-y-auto">
        {suggestions.map((snake) => (
          <li
            key={snake._id}
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelectSnake(snake)}
          >
            {snake.image && (
              <img
                src={snake.image}
                alt={snake.name}
                className="w-15 h-15 rounded-full mr-2"
              />
            )}
            <span className="font-medium">{snake.name}</span>
          </li>
        ))}
      </ul>
    );
  };

  const startVoiceRecognition = () => {
    setIsListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setKeyword(transcript);

      handleSearch({ target: { value: transcript } });

      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onspeechend = () => {
      recognition.stop(); // Stop automatically after capturing speech
      setIsListening(false);
    };
  };

  useEffect(() => {
    // Check if SpeechRecognition is available
    if (!SpeechRecognition) {
      console.warn("Speech Recognition is not supported in this browser.");
    }
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Input */}
      <div className="flex items-center justify-center gap-2">
        <input
          type="text"
          value={keyword}
          onChange={handleSearch}
          placeholder="Search for snakes..."
          autoComplete="off"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Voice  Button */}
        <button
          onClick={startVoiceRecognition}
          disabled={isListening}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full "
        >
          {isListening ? (
            <MdSettingsVoice className="text-3xl" />
          ) : (
            <MdOutlineSettingsVoice className="text-3xl" />
          )}
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute w-full mt-1  bg-white border border-gray-200 rounded-lg shadow-md">
          {renderSuggestions()}
        </div>
      )}

      {/* Display Selected Snake Details */}
      {selectedSnake && (
        <div className="mt-4 p-4 border rounded-lg shadow-lg bg-white">
          <h2 className="text-xl font-semibold">{selectedSnake.name}</h2>
          {selectedSnake.image && (
            <img
              src={selectedSnake.image}
              alt={selectedSnake.name}
              className="w-32 h-32 rounded-lg mt-2"
            />
          )}
          <p className="text-gray-700">
            <strong>Color:</strong> {selectedSnake.color}
          </p>
          <p className="text-gray-700">
            <strong>Size:</strong> {selectedSnake.size}
          </p>
          <p className="text-gray-700">
            <strong>Length:</strong> {selectedSnake.length}
          </p>
          <p className="text-gray-700">
            <strong>Head Shape:</strong> {selectedSnake.headShape}
          </p>
          <p className="text-gray-700">
            <strong>Pattern:</strong> {selectedSnake.pattern}
          </p>
          <p className="text-gray-700">
            <strong>Behavior:</strong> {selectedSnake.behavior}
          </p>
          <p className="text-gray-700">
            <strong>Venom Type:</strong> {selectedSnake.venomType}
          </p>
          <p className="text-gray-700">
            <strong>Pain Level:</strong> {selectedSnake.painLevel}
          </p>
          <p className="text-gray-700">
            <strong>Pain Type:</strong> {selectedSnake.painType}
          </p>
          <p className="text-gray-700">
            <strong>Time to Symptoms:</strong> {selectedSnake.timeToSymptoms}
          </p>
          <p className="text-gray-700">
            <strong>Common Symptoms:</strong>
          </p>
          <ul className="list-disc pl-5">
            {selectedSnake.commonSymptoms.map((symptom, index) => (
              <li key={index} className="text-gray-700">
                {symptom}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearch;
