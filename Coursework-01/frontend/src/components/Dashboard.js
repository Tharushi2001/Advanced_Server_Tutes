import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/country.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [apiKey, setApiKey] = useState(null);
  const [apiKeyId, setApiKeyId] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countryName, setCountryName] = useState('');
  const [countryDetails, setCountryDetails] = useState(null);
  const navigate = useNavigate();

  // Fetch current API key
  const fetchApiKey = async () => {
    setLoading(true);
    setError(null);

    try {
      const localKey = localStorage.getItem('apiKey');
      if (!localKey) {
        setError('API key is not available. Please login again.');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:3001/api/apikeys/getkey', {
        headers: { 'x-api-key': localKey },
      });

      setApiKey(response.data.apiKey);
      setApiKeyId(response.data.id); // Store the key ID
    } catch (err) {
      setError('Failed to fetch the API key');
    } finally {
      setLoading(false);
    }
  };

  // Update API key
  const updateApiKey = async () => {
    setLoading(true);
    setError(null);

    try {
      const currentKey = localStorage.getItem('apiKey');
      if (!currentKey || !apiKeyId) {
        setError('Missing API key or key ID. Please try again.');
        setLoading(false);
        return;
      }

      const response = await axios.put(`http://localhost:3001/api/apikeys/update/${apiKeyId}`, {}, {
        headers: { 'x-api-key': currentKey },
      });

      const newKey = response.data.apiKey;
      localStorage.setItem('apiKey', newKey);
      setApiKey(newKey);
      fetchApiKey();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update API key');
    } finally {
      setLoading(false);
    }
  };

  // Fetch country details
  const fetchCountryDetails = async (e) => {
    e.preventDefault();
    setError(null);
    setCountryDetails(null);

    try {
      const response = await axios.get(`http://localhost:3001/api/countries/${countryName}`, {
        headers: { 'x-api-key': apiKey },
      });
      setCountryDetails(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch country details. Please try again.');
    }
  };

  // Logout and clear API key
  const logoutAndClearApiKey = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/logout', {}, {
        withCredentials: true, 
      });

      localStorage.removeItem('apiKey');
      setApiKey(null);
      setApiKeyId(null);
      navigate('/');  // Redirect to the homepage after logout
    } catch (err) {
      console.error('Logout failed:', err.response?.data?.message || err.message);
      setError('Logout failed. Please try again.');
    }
  };

  // Fetch API key on component mount
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

          <button
            className='key-btn'
            style={{ padding: '10px', borderRadius: '20px', backgroundColor: '#4CAF50', color: 'white', border: '1px solid' }}
            onClick={updateApiKey}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update API Key'}
          </button>

          <button
            className='key-btn'
            style={{
              padding: '10px',
              borderRadius: '20px',
              backgroundColor: '#E53935',
              color: 'white',
              border: '1px solid',
            }}
            onClick={async () => {
              setError(null);
              setLoading(true);
              try {
                const currentKey = localStorage.getItem('apiKey');
                if (!currentKey || !apiKeyId) {
                  setError('Missing API key or key ID. Please try again.');
                  setLoading(false);
                  return;
                }

                await axios.delete(`http://localhost:3001/api/apikeys/delete/${apiKeyId}`, {
                  headers: { 'x-api-key': currentKey },
                });

                localStorage.removeItem('apiKey');
                setApiKey(null);
                setApiKeyId(null);
                alert('API Key deleted successfully.');
              } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete API key');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete API Key'}
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

        <button onClick={logoutAndClearApiKey} style={{ marginTop: '20px' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
