import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li><Link to="/" className="text-blue-600">Employee Records</Link></li>
        {/* Add more navigation items if needed */}
      </ul>
    </nav>
  );
};

export default Navbar;
