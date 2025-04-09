import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/country.css';

const Dashboard = () => {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countryName, setCountryName] = useState('');
  const [countryDetails, setCountryDetails] = useState(null);

  // Function to logout and clear API key
  const logoutAndClearApiKey = () => {
    localStorage.removeItem('apiKey');  // Remove the API key from localStorage
    setApiKey(null);  // Clear the API key from the state
  };

  // Function to fetch the current API key
  const fetchApiKey = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get the user's API key from localStorage
      const apiKey = localStorage.getItem('apiKey');

      if (!apiKey) {
        setError('API key is not available. Please login again.');
        setLoading(false);
        return;
      }

      // Make a request to the backend to fetch the latest API key for the logged-in user
      const response = await axios.get('http://localhost:3001/api/apikeys/getkey', {
        headers: {
          'x-api-key': apiKey, // Include the API key in the request header for authentication
        },
      });

      // Set the API key to state
      setApiKey(response.data.apiKey);
    } catch (err) {
      setError('Failed to fetch the API key');
    } finally {
      setLoading(false);
    }
  };

  const updateApiKey = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const apiKey = localStorage.getItem('apiKey');
      if (!apiKey) {
        setError('API key is not available. Please login again.');
        setLoading(false);
        return;
      }
  
      // Send a PUT request to update the API key
      const response = await axios.put('http://localhost:3001/api/apikeys/update/your-key-id', {
        // if body is required, add here
      }, {
        headers: {
          'x-api-key': apiKey,
        },
      });
  
      // Update the localStorage and state with new API key
      const newKey = response.data.apiKey;
      localStorage.setItem('apiKey', newKey);
      setApiKey(newKey);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update API key');
    } finally {
      setLoading(false);
    }
  };
  

  // Function to fetch country details
  const fetchCountryDetails = async (e) => {
    e.preventDefault();
    setError(null);
    setCountryDetails(null);

    try {
      const response = await axios.get(`http://localhost:3001/api/countries/${countryName}`, {
        headers: {
          'x-api-key': apiKey, // Use the fetched API key for authentication
        },
      });
      setCountryDetails(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch country details. Please try again.');
    }
  };

  // UseEffect to fetch the API key when the component mounts
  useEffect(() => {
    fetchApiKey();
  }, []);

  return (
    <div className='dashboard-Container'>
      <div className='content'>
        <h1>Dashboard</h1>

        <div className='apigenerate'>
          <button
            className='key-btn'
            style={{ padding: '10px', borderRadius: '20px', backgroundColor: '#3674B5', color: 'white', border: '1px solid' }}
            onClick={fetchApiKey}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Get My API Key'}
          </button>

           {/* ✅ Update API Key Button */}
  <button
    className='key-btn'
    style={{
      padding: '10px',
      borderRadius: '20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: '1px solid'
    }}
    onClick={updateApiKey}
    disabled={loading}
  >
    {loading ? 'Updating...' : 'Update API Key'}
  </button>


          {error && <p style={{ color: 'red' }}>{error}</p>}

          {apiKey && (
            <div>
              <h2>Your API Key:</h2>
              <p>{apiKey}</p>
            </div>
          )}
        </div>

        <div className='country-details'>
          <form onSubmit={fetchCountryDetails} style={{ marginTop: '20px' }}>
            <input
              type="text"
              placeholder="Enter Country Name"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              required
            />
            <button type="submit" className="search-btn">Get Country Details</button>
          </form>

          {countryDetails && (
            <div style={{ marginTop: '20px' }}>
              <h3>Country Details:</h3>
              <p><strong>Name:</strong> {countryDetails.name}</p>
              <p><strong>Capital:</strong> {countryDetails.capital}</p>
              <p><strong>Currencies:</strong> {countryDetails.currencies.join(', ')}</p>
              <p><strong>Languages:</strong> {countryDetails.languages.join(', ')}</p>
              <img src={countryDetails.flag} alt={`${countryDetails.name} flag`} style={{ width: '100px' }} />
            </div>
          )}
        </div>

        {/* Add a logout button */}
        <button onClick={logoutAndClearApiKey} style={{ marginTop: '20px' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
