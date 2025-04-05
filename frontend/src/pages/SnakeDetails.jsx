import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import SnakeList from '../components/snakes/SnakeList';
import SnakeModal from '../components/snakes/SnakeModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { useSnakesContext } from '../hooks/useSnakesContext';

const SnakeDetails = () => {
  const { province } = useParams();
  const { snakes, dispatch } = useSnakesContext();
  const [filteredSnakes, setFilteredSnakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSnake, setEditingSnake] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVenomType, setSelectedVenomType] = useState('');

  useEffect(() => {
    const fetchSnakes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/api/snakes${province ? `/province/${province}` : ''}`);
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: 'SET_SNAKES', payload: json.data });
          setFilteredSnakes(json.data);
        } else {
          setError(json.error || 'Failed to fetch snakes');
        }
      } catch (error) {
        console.error('Error fetching snakes:', error);
        setError('Failed to fetch snakes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSnakes();
  }, [dispatch, province]);

  useEffect(() => {
    if (snakes) {
      filterSnakes();
    }
  }, [snakes, searchTerm, selectedVenomType]);

  const filterSnakes = () => {
    if (!snakes || !Array.isArray(snakes)) {
      setFilteredSnakes([]);
      return;
    }

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
        const response = await axios.delete(`http://localhost:3000/api/snakes/${id}`);
        if (response.data.success) {
          dispatch({ type: 'DELETE_SNAKE', payload: id });
        } else {
          setError('Failed to delete snake');
        }
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
        if (response.data.success) {
          dispatch({ type: 'UPDATE_SNAKE', payload: response.data.data });
          handleModalClose();
        } else {
          setError('Failed to update snake');
        }
      } else {
        const response = await axios.post('http://localhost:3000/api/snakes/add', snakeData);
        if (response.data.success) {
          dispatch({ type: 'ADD_SNAKE', payload: response.data.data });
          handleModalClose();
        } else {
          setError('Failed to add snake');
        }
      }
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
  const venomTypes = snakes && Array.isArray(snakes) 
    ? [...new Set(snakes.map(snake => snake.venomType))]
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {province ? `Snakes in ${province}` : 'All Snakes'}
        </h1>
        <button
          onClick={handleAddSnake}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add New Snake
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Search snakes..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <select
          value={selectedVenomType}
          onChange={handleVenomTypeChange}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">All Venom Types</option>
          {venomTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
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