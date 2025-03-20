import React from 'react';
import { Link } from 'react-router-dom'; 
import './css/home.css';
import countryImage from '../assets/images/country.jpg';  

const Home = () => {
    return (
        <div className='home-container'>
            <div>
                <h1>SecureCountryAPI</h1>
                <p>This is a simple application to manage countries and user authentication.</p>
            </div>

            <div className='home-image'>
                <img src={countryImage} alt="Home" className="home-img" />
            </div>

            <div className="links-container">
                <Link to="/login" className="link-button login-button">
                    Login
                </Link>
                <Link to="/register" className="link-button register-button">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Home;
