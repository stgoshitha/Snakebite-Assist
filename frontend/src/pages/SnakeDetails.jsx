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
      // Set content type to multipart/form-data for file uploads
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      if (editingSnake) {
        const response = await axios.put(
          `http://localhost:3000/api/snakes/${editingSnake._id}`, 
          snakeData,
          config
        );
        
        if (response.data.success) {
          dispatch({ type: 'UPDATE_SNAKE', payload: response.data.data });
          handleModalClose();
        } else {
          setError('Failed to update snake');
        }
      } else {
        const response = await axios.post(
          'http://localhost:3000/api/snakes/add', 
          snakeData,
          config
        );
        
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
    <div className="container mx-auto px-4 py-8 font-['Inter']">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        {/* Title Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            {province ? `Snakes in ${province}` : 'Snake Database'}
            <div className="h-1 w-20 bg-indigo-600 mt-2 rounded-full"></div>
          </h1>
        </div>

        {/* Total Snakes Card */}
        <div className="bg-purple-50 rounded-xl p-4 shadow-sm min-w-[200px]">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-purple-900 mb-1">All Snakes</h2>
              <div className="text-4xl font-bold text-purple-900">
                {snakes ? snakes.length : 0}
              </div>
            </div>
            <div className="text-purple-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="1.5"
                  d="M6.5 6.5C3.5 9.5 3.5 14.5 6.5 17.5L12 12L17.5 17.5C20.5 14.5 20.5 9.5 17.5 6.5C14.5 3.5 9.5 3.5 6.5 6.5Z"
                />
                <circle cx="15" cy="9" r="1" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        {/* Add Snake Button */}
        <button
          onClick={handleAddSnake}
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transform hover:translate-y-[-2px] transition-all duration-300 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Snake
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name, color, venom type..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
            </div>
            <select
              value={selectedVenomType}
              onChange={handleVenomTypeChange}
              className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors appearance-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
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
