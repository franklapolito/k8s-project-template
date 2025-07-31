/* import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function PriceMap() {
  // Default position set to Boston, MA
  const position = [42.3601, -71.0589];

  return (
    <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%', marginBottom: '20px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          You are here. <br /> Search for products to see nearby prices.
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default PriceMap; */

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function PriceMap({ reports }) { // Receive reports as a prop
  const position = [42.3601, -71.0589]; // Boston, MA

  return (
    <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%', marginBottom: '20px' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Loop over the reports and create a marker for each one */}
      {reports.map(report => (
        <Marker key={report.report_id} position={[report.lat, report.lng]}>
          <Popup>
            <b>{report.store_name}</b><br />
            Price: ${report.price}<br />
            <small>Reported: {new Date(report.created_at).toLocaleDateString()}</small>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default PriceMap;