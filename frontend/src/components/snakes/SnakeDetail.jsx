import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import ProvinceMap from '../maps/ProvinceMap';
import SideBar from '../common/SideBar';
import Header from '../common/Header';

const SnakeDetail = () => {
  const { id } = useParams();
  const [snake, setSnake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSnake = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/snakes/${id}`);
        if (response.data.success) {
          setSnake(response.data.data);
        } else {
          setError('Failed to fetch snake details');
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching snake details:", error);
        setError('Failed to fetch snake details. Please try again later.');
        setLoading(false);
      }
    };

    fetchSnake();
  }, [id]);

  if (loading) return (
    <div className="flex gap-1">
      <div>
        <SideBar />
      </div>
      <div className="ml-72 flex flex-col gap-2 overflow-auto w-full">
        <Header />
        <LoadingSpinner />
      </div>
    </div>
  );

  if (error) return (
    <div className="flex gap-1">
      <div>
        <SideBar />
      </div>
      <div className="ml-72 flex flex-col gap-2 overflow-auto w-full">
        <Header />
        <ErrorMessage message={error} />
      </div>
    </div>
  );

  if (!snake) return (
    <div className="flex gap-1">
      <div>
        <SideBar />
      </div>
      <div className="ml-72 flex flex-col gap-2 overflow-auto w-full">
        <Header />
        <ErrorMessage message="Snake not found" />
      </div>
    </div>
  );

  // Get the native provinces array or convert single province to array
  const nativeProvinces = Array.isArray(snake.nativeProvinces) 
    ? snake.nativeProvinces 
    : snake.nativeProvince 
      ? [snake.nativeProvince]
      : [];

  return (
    <div className="flex gap-1">
      <div>
        <SideBar />
      </div>
      <div className="ml-72 flex flex-col gap-2 overflow-auto w-full">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Snake Detail Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{snake.name}</h1>
                
                <div className="space-y-6">
                  <div className="relative">
                    <img
                      src={snake.image}
                      alt={snake.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Physical Characteristics Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Physical Characteristics</h2>
                    <div className="space-y-2 text-gray-600">
                      <p><span className="font-medium">Color:</span> {snake.color}</p>
                      <p><span className="font-medium">Size:</span> {snake.size}</p>
                      <p><span className="font-medium">Length:</span> {snake.length}</p>
                      <p><span className="font-medium">Head Shape:</span> {snake.headShape}</p>
                      <p><span className="font-medium">Pattern:</span> {snake.pattern}</p>
                    </div>
                  </div>

                  {/* Location & Behavior Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Location & Behavior</h2>
                    <div className="space-y-2 text-gray-600">
                      <p><span className="font-medium">Native Provinces:</span> {nativeProvinces.join(', ')}</p>
                      <p><span className="font-medium">Behavior:</span> {snake.behavior}</p>
                    </div>
                  </div>

                  {/* Venom & Symptoms Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Venom & Symptoms</h2>
                    <div className="space-y-2 text-gray-600">
                      <p><span className="font-medium">Venom Type:</span> {snake.venomType}</p>
                      <p><span className="font-medium">Pain Level:</span> {snake.painLevel}/10</p>
                      <p><span className="font-medium">Pain Type:</span> {snake.painType}</p>
                      <p><span className="font-medium">Time to Symptoms:</span> {snake.timeToSymptoms}</p>
                    </div>
                  </div>

                  {/* Common Symptoms Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-700">Common Symptoms</h2>
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

            {/* Province Map Section */}
            <div className="sticky top-4">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Native Provinces</h2>
                <div className="h-[600px] md:h-[500px] lg:h-[600px]">
                  <ProvinceMap selectedProvinces={nativeProvinces} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeDetail;
