import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const SnakeDetail = () => {
  const { id } = useParams();
  const [snake, setSnake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSnake = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/snakes/${id}`);
        setSnake(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching snake details:", error);
        setError('Failed to fetch snake details. Please try again later.');
        setLoading(false);
      }
    };

    fetchSnake();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!snake) return <ErrorMessage message="Snake not found" />;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={snake.image}
            alt={snake.name}
            className="w-full h-96 object-cover"
          />
        </div>
        <div className="p-6 md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{snake.name}</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Physical Characteristics</h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Color:</span> {snake.color}</p>
                <p><span className="font-medium">Size:</span> {snake.size}</p>
                <p><span className="font-medium">Length:</span> {snake.length}</p>
                <p><span className="font-medium">Head Shape:</span> {snake.headShape}</p>
                <p><span className="font-medium">Pattern:</span> {snake.pattern}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Behavior & Venom</h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Behavior:</span> {snake.behavior}</p>
                <p><span className="font-medium">Venom Type:</span> {snake.venomType}</p>
                <p><span className="font-medium">Pain Level:</span> {snake.painLevel}/10</p>
                <p><span className="font-medium">Pain Type:</span> {snake.painType}</p>
                <p><span className="font-medium">Time to Symptoms:</span> {snake.timeToSymptoms}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Common Symptoms</h2>
              <ul className="list-disc list-inside text-gray-600">
                {snake.commonSymptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <Link
              to="/admin/snake-details"
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Snake List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeDetail; 