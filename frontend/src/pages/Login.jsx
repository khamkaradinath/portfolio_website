import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post('http://localhost:8000/auth/login', formData);
            login(response.data.access_token);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed');
        }
    };

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center bg-[var(--bg-color)] transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--card-bg)] p-8 rounded-2xl shadow-xl w-full max-w-md border border-[var(--border-color)] backdrop-blur-sm"
            >
                <h2 className="text-3xl font-bold text-center mb-8 text-[var(--text-color)] uppercase tracking-wide">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[var(--text-color)]"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[var(--text-color)]"
                            placeholder="Enter your password"
                        />
                    </div>
                    <Button type="submit" className="w-full">Sign In</Button>
                </form>
                <div className="mt-6 text-center text-[var(--text-muted)]">
                    Don't have an account? <Link to="/register" className="text-primary hover:text-secondary font-bold">Register</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
