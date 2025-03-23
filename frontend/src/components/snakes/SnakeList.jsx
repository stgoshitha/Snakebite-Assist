import React from 'react';
import { Link } from 'react-router-dom';

const SnakeList = ({ snakes, onEdit, onDelete }) => {
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