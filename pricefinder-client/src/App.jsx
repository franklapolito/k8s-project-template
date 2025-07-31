/* import 'leaflet/dist/leaflet.css'; // <-- Import Leaflet's CSS
import './App.css';
import PriceSubmissionForm from './PriceSubmissionForm';
import PriceMap from './PriceMap'; // <-- Import our new map component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Price Finder</h1>
        <p>Help your community find the best prices near you.</p>
      </header>
      <main>
        <PriceMap /> {/* <-- Render the map component *}
        <PriceSubmissionForm />
      </main>
    </div>
  );
}

export default App;
 */

import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import './App.css';
import PriceSubmissionForm from './PriceSubmissionForm';
import PriceMap from './PriceMap';
import Search from './Search';

function App() {
  // State to hold the price reports fetched from the API
  const [reports, setReports] = useState([]);

// In pricefinder-client/src/App.jsx

const handleSearch = async (productName) => {
  const userLat = 42.3601;
  const userLng = -71.0589;

  try {
    // The URL must start with /api/ to trigger the proxy
    const response = await fetch(`/api/reports?productName=${encodeURIComponent(productName)}&lat=${userLat}&lng=${userLng}`);

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    setReports(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    setReports([]);
  }
};

  return (
    <div className="App">
      <header className="App-header">
        <h1>Price Finder</h1>
        <p>Help your community find the best prices near you.</p>
      </header>
      <main>
        <Search onSearch={handleSearch} />
        <PriceMap reports={reports} />
        <PriceSubmissionForm />
      </main>
    </div>
  );
}

export default App;