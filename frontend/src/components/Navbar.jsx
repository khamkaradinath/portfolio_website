import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon, FaChevronDown } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/');
        setShowDropdown(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="fixed w-full z-50 top-0 left-0 bg-[var(--bg-color)]/90 backdrop-blur-sm border-b border-[var(--border-color)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 rounded-full bg-gray-800 overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
                                <img src="/profile.jpg" alt="Adinath Khamkar" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xl font-bold text-[var(--text-color)] group-hover:text-primary transition-colors">ADINATH</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex md:flex-1 md:items-center md:justify-center">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="text-[var(--text-muted)] hover:text-primary px-3 py-2 rounded-md text-sm font-bold tracking-widest transition-colors">HOME</Link>
                            <Link to="/about" className="text-[var(--text-muted)] hover:text-primary px-3 py-2 rounded-md text-sm font-bold tracking-widest transition-colors">ABOUT</Link>
                            <Link to="/projects" className="text-[var(--text-muted)] hover:text-primary px-3 py-2 rounded-md text-sm font-bold tracking-widest transition-colors">PROJECTS</Link>
                            <Link to="/blog" className="text-[var(--text-muted)] hover:text-primary px-3 py-2 rounded-md text-sm font-bold tracking-widest transition-colors">BLOG</Link>
                            <Link to="/contact" className="text-[var(--text-muted)] hover:text-primary px-3 py-2 rounded-md text-sm font-bold tracking-widest transition-colors">CONTACT</Link>
                            {user?.is_admin && (
                                <Link to="/admin" className="text-[var(--text-muted)] hover:text-primary px-3 py-2 rounded-md text-sm font-bold tracking-widest transition-colors">ADMIN</Link>
                            )}
                        </div>
                    </div>
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-[var(--text-muted)] hover:text-primary transition-colors focus:outline-none"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <FaSun size={20} /> : <FaMoon size={20} />}
                        </button>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center space-x-2 text-[var(--text-color)] hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    <span>{user.sub}</span>
                                    <FaChevronDown size={12} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md shadow-lg py-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-[var(--text-muted)] hover:text-primary hover:bg-[var(--border-color)] transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="text-[var(--text-muted)] hover:text-primary px-3 py-2 rounded-md text-sm font-bold tracking-widest transition-colors">LOGIN</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
