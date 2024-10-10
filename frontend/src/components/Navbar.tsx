import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faList, faCommentDots, faFileAlt, faUser, faCog, faMoon, faBell } from '@fortawesome/free-solid-svg-icons';
import User from '../assets/images/admin.jpg';

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('Requests');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSectionClick = (section: React.SetStateAction<string>) => {
    setActiveSection(section);
    setIsDropdownOpen(false); 
  };

  return (
    <nav className="bg-maroon text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
          e-hospital
        </div>

        <ul className="hidden md:flex space-x-8 items-center">
          <li
            className={`nav-item px-4 py-2 rounded-lg cursor-pointer ${activeSection === 'Dashboard' ? 'bg-white text-maroon' : ''}`}
            onClick={() => handleSectionClick('Dashboard')}
          >
            <FontAwesomeIcon icon={faHome} /> Dashboard
          </li>
          <li
            className={`nav-item px-4 py-2 rounded-lg cursor-pointer ${activeSection === 'Requests' ? 'bg-white text-maroon' : ''}`}
            onClick={() => handleSectionClick('Requests')}
          >
            <FontAwesomeIcon icon={faList} /> Requests
          </li>
          <li
            className={`nav-item px-4 py-2 rounded-lg cursor-pointer ${activeSection === 'Feedbacks' ? 'bg-white text-maroon' : ''}`}
            onClick={() => handleSectionClick('Feedbacks')}
          >
            <FontAwesomeIcon icon={faCommentDots} /> Feedbacks
          </li>
          <li
            className={`nav-item px-4 py-2 rounded-lg cursor-pointer ${activeSection === 'Reports' ? 'bg-white text-maroon' : ''}`}
            onClick={() => handleSectionClick('Reports')}
          >
            <FontAwesomeIcon icon={faFileAlt} /> Reports
          </li>
          <li
            className={`nav-item px-4 py-2 rounded-lg cursor-pointer ${activeSection === 'Patient' ? 'bg-white text-maroon' : ''}`}
            onClick={() => handleSectionClick('Patient')}
          >
            <FontAwesomeIcon icon={faUser} /> Patient
          </li>
          <li
            className={`relative nav-item px-4 py-2 rounded-lg cursor-pointer ${activeSection === 'Settings' ? 'bg-white text-maroon' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <FontAwesomeIcon icon={faCog} /> Settings
            {isDropdownOpen && (
              <ul className="absolute mt-2 bg-white text-black p-2 rounded shadow-lg space-y-2">
                <li className="dropdown-item" onClick={() => setActiveSection('Profile')}>Profile</li>
                <li className="dropdown-item" onClick={() => setActiveSection('Logout')}>Logout</li>
              </ul>
            )}
          </li>
        </ul>

        <div className="hidden md:flex items-center space-x-4">
          <FontAwesomeIcon icon={faMoon} />
          <div className="relative">
            <FontAwesomeIcon icon={faBell} />
            <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-xs">1</span>
          </div>
          <span className="pl-4">Welcome <b>Admin</b></span>
          <img src={User} alt="UserAvatar" className="w-8 h-8 rounded-full" />
        </div>

        <button
          className="md:hidden flex items-center"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <FontAwesomeIcon icon={faList} />
        </button>
      </div>

      {isDropdownOpen && (
        <ul className="md:hidden mt-4 space-y-4">
          <li className={`nav-item px-4 py-2 rounded-lg ${activeSection === 'Dashboard' ? 'bg-white text-maroon' : ''}`} onClick={() => handleSectionClick('Dashboard')}>
            <FontAwesomeIcon icon={faHome} /> Dashboard
          </li>
          <li className={`nav-item px-4 py-2 rounded-lg ${activeSection === 'Requests' ? 'bg-white text-maroon' : ''}`} onClick={() => handleSectionClick('Requests')}>
            <FontAwesomeIcon icon={faList} /> Requests
          </li>
          <li className={`nav-item px-4 py-2 rounded-lg ${activeSection === 'Feedbacks' ? 'bg-white text-maroon' : ''}`} onClick={() => handleSectionClick('Feedbacks')}>
            <FontAwesomeIcon icon={faCommentDots} /> Feedbacks
          </li>
          <li className={`nav-item px-4 py-2 rounded-lg ${activeSection === 'Reports' ? 'bg-white text-maroon' : ''}`} onClick={() => handleSectionClick('Reports')}>
            <FontAwesomeIcon icon={faFileAlt} /> Reports
          </li>
          <li className={`nav-item px-4 py-2 rounded-lg ${activeSection === 'Patient' ? 'bg-white text-maroon' : ''}`} onClick={() => handleSectionClick('Patient')}>
            <FontAwesomeIcon icon={faUser} /> Patient
          </li>
          <li className={`nav-item px-4 py-2 rounded-lg ${activeSection === 'Settings' ? 'bg-white text-maroon' : ''}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <FontAwesomeIcon icon={faCog} /> Settings
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
