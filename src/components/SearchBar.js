
import React, { useState } from 'react';
import { Search } from 'lucide-react';

function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input type="text" placeholder="Search movies..." value={query} onChange={(e) => setQuery(e.target.value)} />
            <button type="submit"><Search /></button>
        </form>
    );
}

export default SearchBar;