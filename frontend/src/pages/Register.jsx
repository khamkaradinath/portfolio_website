import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/auth/register', {
                username,
                email,
                password
            });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed: ' + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center bg-[var(--bg-color)] transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--card-bg)] p-8 rounded-2xl shadow-xl w-full max-w-md border border-[var(--border-color)] backdrop-blur-sm"
            >
                <h2 className="text-3xl font-bold text-center mb-8 text-[var(--text-color)] uppercase tracking-wide">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[var(--text-color)]"
                            placeholder="Choose a username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[var(--text-color)]"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[var(--text-color)]"
                            placeholder="Choose a password"
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full">Sign Up</Button>
                </form>
                <div className="mt-6 text-center text-[var(--text-muted)]">
                    Already have an account? <Link to="/login" className="text-primary hover:text-secondary font-bold">Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
