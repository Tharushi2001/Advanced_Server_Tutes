import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if fields are empty
        if (!username || !password) {
            alert('Please fill in all fields');
            return; // Prevent sending the request if fields are empty
        }

        const data = {
            username: username,
            password: password
        };

        try {
            // Send login data to backend
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Store the token in localStorage/sessionStorage
                console.log('Setting API key:', result.apiKey); // Log the API key
                localStorage.setItem('apiKey', result.apiKey);

                alert('Login successful!');
                navigate('/dashboard'); // Navigate to the dashboard or another protected route
            } else {
                alert(`Error: ${result.error || 'Invalid credentials!'}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login.');
        }
    };

    return (
        <div className='login-container'>
            <div className='login-form'>
        <div >
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{  padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
                    Login
                </button>
            </form>
        </div>
        </div>
        </div>
    );
};

export default Login;
