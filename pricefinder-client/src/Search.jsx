import React, { useState } from 'react';

function Search({ onSearch }) {
  const [productName, setProductName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!productName) return;
    onSearch(productName);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        placeholder="Enter a product to find..."
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default Search;