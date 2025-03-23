import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import SnakeList from '../components/snakes/SnakeList';
import SnakeDetail from '../components/snakes/SnakeDetail';
import SnakeModal from '../components/snakes/SnakeModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const SnakeDetails = () => {
  const [snakes, setSnakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnake, setEditingSnake] = useState(null);
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    fetchSnakes();
  }, []);

  const fetchSnakes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/snakes');
      setSnakes(response.data.data);
      setLoading(false);
    } catch (_err) {
      setError('Failed to fetch snakes. Please try again later.');
      setLoading(false);
    }
  };

  const handleAddSnake = () => {
    setEditingSnake(null);
    setIsModalOpen(true);
  };

  const handleEditSnake = (snake) => {
    setEditingSnake(snake);
    setIsModalOpen(true);
  };

  const handleDeleteSnake = async (id) => {
    if (window.confirm('Are you sure you want to delete this snake?')) {
      try {
        await axios.delete(`http://localhost:3000/api/snakes/${id}`);
        setSnakes(snakes.filter(snake => snake._id !== id));
      } catch (_err) {
        setError('Failed to delete snake. Please try again later.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingSnake(null);
  };

  const handleSnakeSubmit = async (snakeData) => {
    try {
      if (editingSnake) {
        const response = await axios.put(`http://localhost:3000/api/snakes/${editingSnake._id}`, snakeData);
        setSnakes(snakes.map(snake => 
          snake._id === editingSnake._id ? response.data.data : snake
        ));
      } else {
        const response = await axios.post('http://localhost:3000/api/snakes/add', snakeData);
        setSnakes([...snakes, response.data.data]);
      }
      handleModalClose();
    } catch (_err) {
      setError('Failed to save snake. Please try again later.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // If we have an ID from the URL params, render the detail view directly
  if (id) {
    return <SnakeDetail />;
  }

  // For nested routes within admin layout
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Snake Details</h1>
        <button
          onClick={handleAddSnake}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Add New Snake
        </button>
      </div>

      {location.pathname === "/admin/snake-details" ? (
        <SnakeList
          snakes={snakes}
          onEdit={handleEditSnake}
          onDelete={handleDeleteSnake}
        />
      ) : (
        <Routes>
          <Route
            path="/"
            element={
              <SnakeList
                snakes={snakes}
                onEdit={handleEditSnake}
                onDelete={handleDeleteSnake}
              />
            }
          />
          <Route path="/:id" element={<SnakeDetail />} />
        </Routes>
      )}

      {isModalOpen && (
        <SnakeModal
          snake={editingSnake}
          onClose={handleModalClose}
          onSubmit={handleSnakeSubmit}
        />
      )}
    </div>
  );
};

export default SnakeDetails; 