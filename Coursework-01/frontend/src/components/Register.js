import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook to navigate after registration

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
            // Send registration data to backend
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // If registration is successful, navigate to login page
                alert('Registration successful!');
                navigate('/login');
            } else {
                alert(`Error: ${result.error || 'Something went wrong!'}`);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('An error occurred during registration.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '4px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', borderRadius: '4px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
