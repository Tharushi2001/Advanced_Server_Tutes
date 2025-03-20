import React from 'react';
import { Link } from 'react-router-dom';  // Import Link for navigation

const Home = () => {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Welcome to My Application</h1>
            <p>This is a simple application to manage countries and user authentication.</p>
            <div>
                <Link to="/login" style={{ margin: '10px', textDecoration: 'none', color: 'blue' }}>
                    Login
                </Link>
                <Link to="/register" style={{ margin: '10px', textDecoration: 'none', color: 'blue' }}>
                    Register
                </Link>
                
            </div>
        </div>
    );
};

export default Home;
