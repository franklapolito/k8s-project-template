/* // src/PriceSubmissionForm.jsx
import React, { useState } from 'react';

function PriceSubmissionForm() {
  // Use the 'useState' hook to manage the state for each form input
  const [productId, setProductId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [price, setPrice] = useState('');

  // This function will be called when the form is submitted
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevents the browser from reloading the page

    const reportData = {
      // For now, we'll use placeholder IDs.
      // Later, these would come from the logged-in user.
      userId: 1, 
      productId: parseInt(productId),
      storeId: parseInt(storeId),
      price: parseFloat(price)
    };

    console.log('Submitting data:', reportData);
    alert('Form submitted! Check the browser console (View > Developer > JavaScript Console).');
  };

  return (
    <form onSubmit={handleSubmit} className="price-form">
      <h2>Submit a Price</h2>
      <div className="form-field">
        <label>Product ID:</label>
        <input
          type="number"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="e.g., 1"
          required
        />
      </div>
      <div className="form-field">
        <label>Store ID:</label>
        <input
          type="number"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          placeholder="e.g., 1"
          required
        />
      </div>
      <div className="form-field">
        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g., 4.99"
          required
        />
      </div>
      <button type="submit">Submit Price</button>
    </form>
  );
}

export default PriceSubmissionForm; */

// src/PriceSubmissionForm.jsx
import React, { useState } from 'react';

function PriceSubmissionForm() {
  const [productId, setProductId] = useState('');
  const [storeId, setStoreId] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState(''); // To show success/error messages

  // Make the function asynchronous to use await
  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(''); // Clear previous messages

    const reportData = {
      userId: 1, // Placeholder
      productId: parseInt(productId),
      storeId: parseInt(storeId),
      price: parseFloat(price)
    };

    try {
      // Send the data to the backend API
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        // If the server response is not successful, throw an error
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Success:', result);
      setMessage('Price report submitted successfully!');

      // Clear the form fields on success
      setProductId('');
      setStoreId('');
      setPrice('');

    } catch (error) {
      console.error('Error submitting report:', error);
      setMessage('Failed to submit price report. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="price-form">
      <h2>Submit a Price</h2>
      {/* Render the message if it exists */}
      {message && <p className="form-message">{message}</p>}

      {/* Form fields remain the same */}
      <div className="form-field">
        <label>Product ID:</label>
        <input
          type="number"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="e.g., 1"
          required
        />
      </div>
      <div className="form-field">
        <label>Store ID:</label>
        <input
          type="number"
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          placeholder="e.g., 1"
          required
        />
      </div>
      <div className="form-field">
        <label>Price:</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g., 4.99"
          required
        />
      </div>
      <button type="submit">Submit Price</button>
    </form>
  );
}

export default PriceSubmissionForm;