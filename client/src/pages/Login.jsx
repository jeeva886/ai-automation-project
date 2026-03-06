import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Key, User } from 'lucide-react';
import './Login.css';

export default function Login({ setRole }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === 'user' && password === 'user123') {
            localStorage.setItem('userRole', 'user');
            setRole('user');
            navigate('/products');
        } else if (username === 'owner' && password === 'owner123') {
            localStorage.setItem('userRole', 'owner');
            setRole('owner');
            navigate('/owner-dashboard');
        } else {
            setError('Invalid credentials. Please check the demo credentials provided below.');
        }
    };

    return (
        <div className="login-container fade-in">
            <div className="login-card card">
                <div className="login-header">
                    <LogIn size={48} className="text-primary mb-4" />
                    <h2>Welcome to Autoflow AI</h2>
                    <p>Please login to continue</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Username</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter username"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrapper">
                            <Key size={18} className="input-icon" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary btn-block">Login</button>
                </form>

                <div className="demo-credentials mt-8 pt-6 border-t border-gray-200">
                    {/* <h3 className="text-lg font-bold mb-4">Demo Credentials</h3>

                    <div className="credential-box mb-4 p-4 rounded bg-gray-50 border border-gray-200">
                        <h4 className="font-bold text-gray-700 mb-2">🧑‍💼 Customer / User Login</h4>
                        <p className="text-sm"><strong>Username:</strong> user</p>
                        <p className="text-sm"><strong>Password:</strong> user123</p>
                        <p className="text-xs text-gray-500 mt-1">Has access to view products and place orders.</p>
                    </div>

                    <div className="credential-box p-4 rounded bg-indigo-50 border border-indigo-100">
                        <h4 className="font-bold text-indigo-700 mb-2">👑 Store Owner / Admin Login</h4>
                        <p className="text-sm"><strong>Username:</strong> owner</p>
                        <p className="text-sm"><strong>Password:</strong> owner123</p>
                        <p className="text-xs text-gray-500 mt-1">Has access to Dashboard, AI Workflows, and Inventory.</p>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
