import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user, loading, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('blog');

    // Blog State
    const [blogTitle, setBlogTitle] = useState('');
    const [blogSubtitle, setBlogSubtitle] = useState('');
    const [blogContent, setBlogContent] = useState('');
    const [blogTags, setBlogTags] = useState('');
    const [blogImage, setBlogImage] = useState(null);

    // Project State
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [projectImage, setProjectImage] = useState(null);
    const [projectUrl, setProjectUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    const getAuthHeader = () => {
        return { headers: { Authorization: `Bearer ${user?.token}`, 'Content-Type': 'multipart/form-data' } };
    };

    const handleCreateBlog = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', blogTitle);
            formData.append('subtitle', blogSubtitle);
            formData.append('content', blogContent);
            formData.append('tags', blogTags);
            if (blogImage) {
                formData.append('image', blogImage);
            }

            await axios.post('http://localhost:8000/blog/', formData, getAuthHeader());
            alert('Blog post created!');
            setBlogTitle('');
            setBlogSubtitle('');
            setBlogContent('');
            setBlogTags('');
            setBlogImage(null);
        } catch (error) {
            console.error('Error creating blog:', error);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please login again.');
                logout();
                navigate('/login');
            } else if (error.response && error.response.status === 403) {
                alert('You are not authorized to perform this action. Admin access required.');
            } else {
                alert('Failed to create blog');
            }
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', projectTitle);
            formData.append('description', projectDesc);
            if (projectImage) {
                formData.append('image', projectImage);
            }
            if (projectUrl) formData.append('project_url', projectUrl);
            if (githubUrl) formData.append('github_url', githubUrl);

            await axios.post('http://localhost:8000/projects/', formData, getAuthHeader());
            alert('Project created!');
            setProjectTitle('');
            setProjectDesc('');
            setProjectImage(null);
            setProjectUrl('');
            setGithubUrl('');
        } catch (error) {
            console.error('Error creating project:', error);
            if (error.response && error.response.status === 401) {
                alert('Session expired. Please login again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else if (error.response && error.response.status === 403) {
                alert('You are not authorized to perform this action. Admin access required.');
            } else {
                alert('Failed to create project');
            }
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12 text-[var(--text-color)] uppercase tracking-wide">Admin Dashboard</h2>

                <div className="flex justify-center space-x-4 mb-8">
                    <button
                        onClick={() => setActiveTab('blog')}
                        className={`px-6 py-2 rounded-full font-bold transition-colors ${activeTab === 'blog' ? 'bg-primary text-black' : 'bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--border-color)] border border-[var(--border-color)]'}`}
                    >
                        Write Blog
                    </button>
                    <button
                        onClick={() => setActiveTab('project')}
                        className={`px-6 py-2 rounded-full font-bold transition-colors ${activeTab === 'project' ? 'bg-primary text-black' : 'bg-[var(--card-bg)] text-[var(--text-muted)] hover:bg-[var(--border-color)] border border-[var(--border-color)]'}`}
                    >
                        Add Project
                    </button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border-color)] shadow-lg backdrop-blur-sm"
                >
                    {activeTab === 'blog' ? (
                        <form onSubmit={handleCreateBlog} className="space-y-6">
                            <h3 className="text-2xl font-bold text-[var(--text-color)] mb-6 uppercase tracking-wide">Create New Blog Post</h3>
                            <div>
                                <label className="block text-[var(--text-muted)] mb-2 uppercase tracking-wider text-sm font-bold">Title</label>
                                <input
                                    type="text"
                                    value={blogTitle}
                                    onChange={(e) => setBlogTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary text-[var(--text-color)] outline-none transition-colors focus:ring-1 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[var(--text-muted)] mb-2 uppercase tracking-wider text-sm font-bold">Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => setBlogImage(e.target.files[0])}
                                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary text-[var(--text-color)] outline-none transition-colors focus:ring-1 focus:ring-primary"
                                    accept="image/*"
                                />
                            </div>
                            <div>
                                <label className="block text-[var(--text-muted)] mb-2 uppercase tracking-wider text-sm font-bold">Subtitle</label>
                                <input
                                    type="text"
                                    value={blogSubtitle}
                                    onChange={(e) => setBlogSubtitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary text-[var(--text-color)] outline-none transition-colors focus:ring-1 focus:ring-primary"
                                    placeholder="Short description or subtitle"
                                />
                            </div>
                            <div>
                                <label className="block text-[var(--text-muted)] mb-2 uppercase tracking-wider text-sm font-bold">Tags</label>
                                <input
                                    type="text"
                                    value={blogTags}
                                    onChange={(e) => setBlogTags(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary text-[var(--text-color)] outline-none transition-colors focus:ring-1 focus:ring-primary"
                                    placeholder="Comma separated tags (e.g. React, Python)"
                                />
                            </div>
                            <div>
                                <label className="block text-[var(--text-muted)] mb-2 uppercase tracking-wider text-sm font-bold">Content</label>
                                <textarea
                                    value={blogContent}
                                    onChange={(e) => setBlogContent(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary text-[var(--text-color)] outline-none h-64 transition-colors focus:ring-1 focus:ring-primary"
                                    required
                                />
                            </div>
                            <Button type="submit">Publish Blog</Button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreateProject} className="space-y-6">
                            <h3 className="text-2xl font-bold text-[var(--text-color)] mb-6 uppercase tracking-wide">Add New Project</h3>
                            <div>
                                <label className="block text-[var(--text-muted)] mb-2 uppercase tracking-wider text-sm font-bold">Title</label>
                                <input
                                    type="text"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary text-[var(--text-color)] outline-none transition-colors focus:ring-1 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[var(--text-muted)] mb-2 uppercase tracking-wider text-sm font-bold">Description</label>
                                <textarea
                                    value={projectDesc}
                                    onChange={(e) => setProjectDesc(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary text-[var(--text-color)] outline-none h-32 transition-colors focus:ring-1 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[var(--text-muted)] mb-2 uppercase tracking-wider text-sm font-bold">Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => setProjectImage(e.target.files[0])}
                                    className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary text-[var(--text-color)] outline-none transition-colors focus:ring-1 focus:ring-primary"
                                    accept="image/*"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[var(--text-muted)] mb-2 uppercase tracking-wider text-sm font-bold">Project URL</label>
                                    <input
                                        type="text"
                                        value={projectUrl}
                                        onChange={(e) => setProjectUrl(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary text-[var(--text-color)] outline-none transition-colors focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[var(--text-muted)] mb-2 uppercase tracking-wider text-sm font-bold">GitHub URL</label>
                                    <input
                                        type="text"
                                        value={githubUrl}
                                        onChange={(e) => setGithubUrl(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary text-[var(--text-color)] outline-none transition-colors focus:ring-1 focus:ring-primary"
                                    />
                                </div>
                            </div>
                            <Button type="submit">Add Project</Button>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
