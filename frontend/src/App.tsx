import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import RequestSummary from './components/Requests';
import SearchFilter from './components/SearchFilter';
import Table from './components/Table';

// Define the Filters interface
interface Filters {
  searchTerm: string;
  startDate: Date | null;
  status: string;
  department: string;
}

// App Component
function App() {
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    startDate: null, // Set to null initially
    status: '',
    department: '',
  });

  const handleDownload = () => {
    // Implement your download logic here
    console.log('Download initiated');
    // e.g., export data as CSV or trigger a file download
  };

  const handleSearch = (appliedFilters: Filters) => {
    setFilters(appliedFilters);
    // Implement your search logic here
    console.log('Applied Filters:', appliedFilters);
    // e.g., fetch data based on the filters
  };

  return (
    <div className="App">
      <Navbar />
      <RequestSummary />
      <SearchFilter onSearch={handleSearch} onDownload={handleDownload} />
      <Table  />
    </div>
  );
}

export default App;
