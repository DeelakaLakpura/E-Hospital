// SearchFilter.tsx

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faDownload, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface SearchFilterProps {
  onSearch: (filters: {
    searchTerm: string;
    startDate: Date | null;
    status: string;
    department: string;
  }) => void;
  onDownload: () => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onDownload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState('');

  const handleApplyFilters = () => {
    onSearch({ searchTerm, startDate, status, department });
  };

  return (
    <div className='bg-gray-100'>
      <div className="flex flex-col md:flex-row md:items-center justify-between p-6 container max-w-8xl mx-auto px-4 space-y-4 md:space-y-0">

        <div className="flex flex-wrap items-center space-x-0 md:space-x-3 w-full md:w-auto">
          <div className="relative w-full md:w-96 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search by"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
          </div>

          <div className="relative w-full md:w-48 mb-4 md:mb-0">
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              dateFormat="MMM d, yyyy"
            />
            <FontAwesomeIcon
              icon={faCalendarAlt}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <div className="w-full md:w-40 mb-4 md:mb-0">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="w-full md:w-40">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Department</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="engineering">Engineering</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-2 justify-end w-full md:w-auto">
          <button 
            onClick={handleApplyFilters}
            className="px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faFilter} />
          </button>
          <button 
            onClick={onDownload}
            className="px-3 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-700 focus:outline-none"
          >
            <FontAwesomeIcon icon={faDownload} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
