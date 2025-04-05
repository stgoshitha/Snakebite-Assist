import React from 'react';
import { Link } from 'react-router-dom';

const SnakeList = ({ snakes, onEdit, onDelete, onDownloadReport }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snakes.map((snake) => (
        <div
          key={snake._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          <img
            src={snake.image}
            alt={snake.name}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{snake.name}</h2>
            <div className="space-y-1 text-gray-600">
              <p><span className="font-medium">Color:</span> {snake.color}</p>
              <p><span className="font-medium">Size:</span> {snake.size}</p>
              <p><span className="font-medium">Length:</span> {snake.length}</p>
              <p><span className="font-medium">Venom Type:</span> {snake.venomType}</p>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Link
                to={`/admin/snake-details/${snake._id}`}
                className="text-blue-600 hover:text-blue-800"
              >
                View Details
              </Link>
              <div className="space-x-2">
                <button
                  onClick={() => onDownloadReport(snake._id)}
                  className="text-green-600 hover:text-green-800"
                  title="Download Report"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={() => onEdit(snake)}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(snake._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SnakeList; 