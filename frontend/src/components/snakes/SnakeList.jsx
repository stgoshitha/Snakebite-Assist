import React from 'react';
import { Link } from 'react-router-dom';

const SnakeList = ({ snakes, onEdit, onDelete, onDownloadReport }) => {
  // Helper function to get venom type badge color based on type
  const getVenomBadgeColor = (venomType) => {
    const type = venomType.toLowerCase();
    if (type.includes('highly')) return 'bg-red-100 text-red-800';
    if (type.includes('moderate')) return 'bg-orange-100 text-orange-800';
    if (type.includes('mild')) return 'bg-yellow-100 text-yellow-800';
    if (type.includes('non')) return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {snakes.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No snakes found</h3>
          <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        snakes.map((snake) => (
          <div
            key={snake._id}
            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
          >
            <div className="relative">
              <img
                src={snake.image || 'https://images.unsplash.com/photo-1567527259238-55878ec8cce5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'}
                alt={snake.name}
                className="w-full h-52 object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1567527259238-55878ec8cce5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70"></div>
              <h2 className="absolute bottom-3 left-4 text-xl font-bold text-white">{snake.name}</h2>
              
              <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-medium ${getVenomBadgeColor(snake.venomType)}`}>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                  </svg>
                  {snake.venomType}
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm">
                  <span className="w-20 text-gray-500">Color:</span>
                  <span className="font-medium text-gray-700">{snake.color}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="w-20 text-gray-500">Size:</span>
                  <span className="font-medium text-gray-700">{snake.size}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="w-20 text-gray-500">Length:</span>
                  <span className="font-medium text-gray-700">{snake.length}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <span className="w-20 text-gray-500">Found in:</span>
                  <span className="font-medium text-gray-700">{snake.nativeProvince}</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <Link
                  to={`/admin/snake-details/${snake._id}`}
                  className="group inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  <span>View Details</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => onDownloadReport(snake._id)}
                    className="p-2 rounded-full bg-gray-50 text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                    title="Download Report"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onEdit(snake)}
                    className="p-2 rounded-full bg-gray-50 text-amber-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    title="Edit Snake"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(snake._id)}
                    className="p-2 rounded-full bg-gray-50 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    title="Delete Snake"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SnakeList; 