import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Update import for Routes
import Home from './components/Home'; // Update the path to match the location
import Login from './components/Login'; // Import the Login component
import Register from './components/Register'; // Import the Register component
import Dashboard from './components/Dashboard';


const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} /> {/* Home route */}
                    <Route path="/login" element={<Login />} /> {/* Login route */}
                    <Route path="/register" element={<Register />} /> {/* Register route */}
                    <Route path="/dashboard" element={<Dashboard />} /> {/* Register route */}
            
                </Routes>
            </div>
        </Router>
    );
};

export default App;
