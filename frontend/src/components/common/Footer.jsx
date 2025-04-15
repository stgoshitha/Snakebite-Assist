import React from 'react'

const Footer = () => {
  return (
    <div><footer className="bg-gray-900 text-white px-6 py-12">
    <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
      
      <div>
        <h2 className="text-2xl font-bold mb-2">🐍 Snakebite Assist</h2>
        <p className="text-gray-400 mb-4">
          Your AI-powered emergency guide for snakebites — identify snakes, get first aid tips, and find nearby hospitals fast.
        </p>
        <div className="flex space-x-4 text-xl">
          <a href="#" className="hover:text-blue-500"><i className="fab fa-facebook-f"></i></a>
          <a href="#" className="hover:text-blue-400"><i className="fab fa-x-twitter"></i></a>
          <a href="#" className="hover:text-pink-400"><i className="fab fa-instagram"></i></a>
          <a href="#" className="hover:text-blue-300"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
        <ul className="space-y-2 text-gray-400">
          <li><a href="/about" className="hover:text-white">About</a></li>
          <li><a href="/hospitals" className="hover:text-white">Hospitals</a></li>
          <li><a href="/blog" className="hover:text-white">Blog</a></li>
          <li><a href="/help" className="hover:text-white">Help Center</a></li>
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
        <p className="text-gray-400 mb-2"><i className="fas fa-envelope mr-2"></i> support@snakeassist.com</p>
        <p className="text-gray-400 mb-2"><i className="fas fa-phone mr-2"></i> +94 77 123 4567</p>
        <p className="text-gray-400"><i className="fas fa-map-marker-alt mr-2"></i> Colombo, Sri Lanka</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Subscribe</h3>
        <p className="text-gray-400 mb-4">Get updates on snakebite safety, tips & tools.</p>
        <form className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-md text-black focus:outline-none"
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white"
          >
            Subscribe
          </button>
        </form>
      </div>
  
    </div>

    <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
      &copy; 2025 Snakebite Assist. All rights reserved.
    </div>
  </footer></div>
  )
}

export default Footer