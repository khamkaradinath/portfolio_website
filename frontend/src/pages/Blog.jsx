import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const Blog = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/blog/`);
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
                setBlogs([
                    { id: 1, title: 'Getting Started with FastAPI', content: 'FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.6+ based on standard Python type hints.', created_at: '2023-10-01', image_url: 'https://via.placeholder.com/150' },
                    { id: 2, title: 'React Hooks Explained', content: 'Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.', created_at: '2023-10-05', image_url: 'https://via.placeholder.com/150' },
                ]);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
            <div className="max-w-3xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-serif font-bold mb-16 text-[var(--text-color)] border-b border-[var(--border-color)] pb-4"
                >
                    Stories
                </motion.h2>
                <div className="space-y-12">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={blog.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col md:flex-row gap-8 items-start border-b border-[var(--border-color)] pb-12 last:border-0"
                        >
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center space-x-2 mb-2">
                                    <div className="w-6 h-6 rounded-full bg-gray-700"></div>
                                    <span className="text-sm font-medium text-[var(--text-muted)]">Adina</span>
                                    <span className="text-[var(--text-muted)]">·</span>
                                    <span className="text-sm text-[var(--text-muted)]">{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <Link to={`/blog/${blog.id}`}>
                                    <h3 className="text-2xl font-bold font-serif leading-tight text-[var(--text-color)] hover:text-primary cursor-pointer transition-colors">
                                        {blog.title}
                                    </h3>
                                </Link>
                                {blog.subtitle && (
                                    <p className="text-[var(--text-muted)] font-serif text-lg leading-snug">
                                        {blog.subtitle}
                                    </p>
                                )}
                                <p className="text-[var(--text-muted)] font-serif leading-relaxed line-clamp-2">
                                    {blog.content}
                                </p>
                                <div className="pt-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {blog.tags && blog.tags.map(tag => (
                                            <span key={tag.id} className="bg-[var(--card-bg)] px-3 py-1 rounded-full text-xs text-[var(--text-muted)] border border-[var(--border-color)]">{tag.name}</span>
                                        ))}
                                        <span className="text-xs text-[var(--text-muted)]">{blog.reading_time || 1} min read</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-primary transition-colors">
                                        <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                            </svg>
                                        </button>
                                        <span className="text-sm">{blog.claps || 0}</span>
                                    </div>
                                </div>
                            </div>
                            {blog.image_url && (
                                <div className="w-full md:w-48 h-32 flex-shrink-0">
                                    <img
                                        src={blog.image_url}
                                        alt={blog.title}
                                        className="w-full h-full object-cover rounded-md border border-[var(--border-color)] opacity-80 hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Blog;
