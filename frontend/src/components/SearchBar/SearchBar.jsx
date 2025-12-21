import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ query, onSearch }) => {
  return (
    <section className="search-section">
      <div className="search-bar">
        <Search size={20} />
        <input 
          placeholder="Search your services..." 
          value={query} 
          onChange={onSearch} 
        />
      </div>
    </section>
  );
};

export default SearchBar;