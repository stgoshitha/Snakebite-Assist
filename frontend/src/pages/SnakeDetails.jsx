import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SnakeList from '../components/snakes/SnakeList';
import SnakeModal from '../components/snakes/SnakeModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const SnakeDetails = () => {
  const [snakes, setSnakes] = useState([]);
  const [filteredSnakes, setFilteredSnakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnake, setEditingSnake] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenomType, setSelectedVenomType] = useState('');

  useEffect(() => {
    fetchSnakes();
  }, []);

  useEffect(() => {
    filterSnakes();
  }, [snakes, searchTerm, selectedVenomType]);

  const fetchSnakes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/snakes');
      setSnakes(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching snakes:", error);
      setError('Failed to fetch snakes. Please try again later.');
      setLoading(false);
    }
  };

  const filterSnakes = () => {
    let filtered = [...snakes];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(snake => 
        snake.name.toLowerCase().includes(searchLower) ||
        snake.color.toLowerCase().includes(searchLower) ||
        snake.venomType.toLowerCase().includes(searchLower)
      );
    }

    // Apply venom type filter
    if (selectedVenomType) {
      filtered = filtered.filter(snake => snake.venomType === selectedVenomType);
    }

    setFilteredSnakes(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleVenomTypeChange = (e) => {
    setSelectedVenomType(e.target.value);
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
      } catch (error) {
        console.error("Error deleting snake:", error);
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
    } catch (error) {
      console.error("Error saving snake:", error);
      setError('Failed to save snake. Please try again later.');
    }
  };

  const handleDownloadReport = async (snakeId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/snakes/${snakeId}/report`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `snake-report-${snakeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading report:", error);
      setError('Failed to download report. Please try again later.');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  // Get unique venom types for filter dropdown
  const venomTypes = [...new Set(snakes.map(snake => snake.venomType))];

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

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, color, or venom type..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Venom Type Filter */}
          <div className="w-full md:w-48">
            <select
              value={selectedVenomType}
              onChange={handleVenomTypeChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Venom Types</option>
              {venomTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <SnakeList
        snakes={filteredSnakes}
        onEdit={handleEditSnake}
        onDelete={handleDeleteSnake}
        onDownloadReport={handleDownloadReport}
      />

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