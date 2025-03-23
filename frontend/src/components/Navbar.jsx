import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Snakebite Assist
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link
              to="/snake-details"
              className={`text-sm font-medium ${
                isActive('/snake-details')
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Snake Details
            </Link>
            <Link
              to="/first-aid"
              className={`text-sm font-medium ${
                isActive('/first-aid')
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              First Aid
            </Link>
            <Link
              to="/emergency-contacts"
              className={`text-sm font-medium ${
                isActive('/emergency-contacts')
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Emergency Contacts
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium ${
                isActive('/about')
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              About
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => {
                // Add mobile menu toggle functionality here
              }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/snake-details"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/snake-details')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Snake Details
          </Link>
          <Link
            to="/first-aid"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/first-aid')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            First Aid
          </Link>
          <Link
            to="/emergency-contacts"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/emergency-contacts')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Emergency Contacts
          </Link>
          <Link
            to="/about"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              isActive('/about')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 