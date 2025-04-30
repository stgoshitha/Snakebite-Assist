import React, { useState, useEffect } from "react";
import { MdOutlineSettingsVoice } from "react-icons/md";
import { MdSettingsVoice } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";

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
    <div className="relative w-full">
      {/* Search Input */}
      <div className="flex items-center justify-center  gap-2">
        <input
          type="text"
          value={keyword}
          onChange={handleSearch}
          placeholder="Search for snakes..."
          autoComplete="off"
          className="w-[75%] px-4 py-3 border border-gray-300 rounded-lg shadow-sm  bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {/* Voice  Button */}
        <button
          onClick={startVoiceRecognition}
          disabled={isListening}
          className=" absolute  text-blue-500 right-30 rounded-full cuorsor-pointer hover:bg-blue-100 p-2 transition duration-200 ease-in-out"
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
        <div className="flex justify-center mt-2">
          <div className="absolute w-[75%] mt-1 bg-white border border-gray-200 shadow-md z-10">
            {renderSuggestions()}
          </div>
        </div>
      )}

      {/* Display Selected Snake Details */}
      {selectedSnake && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="w-[90%] md:w-[75%] max-h-[80vh] overflow-y-auto p-4 border rounded-lg shadow-lg bg-white relative z-50">
            {/* Close Button */}
            <button
              onClick={() => setSelectedSnake(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
              aria-label="Close"
            >
              <AiOutlineClose />
            </button>

            <h2 className="text-xl font-semibold mb-2">{selectedSnake.name}</h2>

            {selectedSnake.image && (
              <img
                src={selectedSnake.image}
                alt={selectedSnake.name}
                className="w-32 h-32 rounded-lg mb-4 object-cover"
              />
            )}

            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Color:</strong> {selectedSnake.color}
              </p>
              <p>
                <strong>Size:</strong> {selectedSnake.size}
              </p>
              <p>
                <strong>Length:</strong> {selectedSnake.length}
              </p>
              <p>
                <strong>Head Shape:</strong> {selectedSnake.headShape}
              </p>
              <p>
                <strong>Pattern:</strong> {selectedSnake.pattern}
              </p>
              <p>
                <strong>Behavior:</strong> {selectedSnake.behavior}
              </p>
              <p>
                <strong>Venom Type:</strong> {selectedSnake.venomType}
              </p>
              <p>
                <strong>Pain Level:</strong> {selectedSnake.painLevel}
              </p>
              <p>
                <strong>Pain Type:</strong> {selectedSnake.painType}
              </p>
              <p>
                <strong>Time to Symptoms:</strong>{" "}
                {selectedSnake.timeToSymptoms}
              </p>

              {selectedSnake.commonSymptoms?.length > 0 && (
                <>
                  <p>
                    <strong>Common Symptoms:</strong>
                  </p>
                  <ul className="list-disc pl-5">
                    {selectedSnake.commonSymptoms.map((symptom, index) => (
                      <li key={index}>{symptom}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearch;
