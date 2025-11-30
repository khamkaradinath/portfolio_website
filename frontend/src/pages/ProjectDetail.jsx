import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const ProjectDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/${id}`);
                setProject(response.data);
            } catch (error) {
                console.error('Error fetching project:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    const handleLike = async () => {
        if (!user) {
            alert("Please login to like this project");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/projects/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProject({ ...project, likes_count: response.data.likes_count, is_liked: response.data.is_liked });
        } catch (error) {
            console.error('Error liking:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/projects/${id}/comment`, {
                content: comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Add new comment to the list
            const newComment = { ...response.data, user: { username: user.username } };
            setProject({ ...project, comments: [...(project.comments || []), newComment] });
            setComment('');
        } catch (error) {
            console.error('Error commenting:', error);
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center text-white">Loading...</div>;
    if (!project) return <div className="min-h-screen pt-24 text-center text-white">Project not found</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
            <article className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center uppercase tracking-wide text-[var(--text-color)]">
                        {project.title}
                    </h1>

                    {project.image_url && (
                        <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    <div className="flex justify-center space-x-6 mb-10">
                        {project.github_url && (
                            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-[var(--text-muted)] hover:text-[var(--text-color)] bg-[var(--card-bg)] border border-[var(--border-color)] px-6 py-3 rounded-full transition-colors shadow-sm hover:shadow-md">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                                <span>View Code</span>
                            </a>
                        )}
                        {project.project_url && (
                            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-black bg-primary hover:bg-secondary px-6 py-3 rounded-full transition-colors shadow-md hover:shadow-lg font-bold">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <span>Live Demo</span>
                            </a>
                        )}
                    </div>

                    <div className="flex items-center justify-between border-y border-[var(--border-color)] py-6 mb-10">
                        <div className="flex items-center space-x-8 text-[var(--text-muted)]">
                            <button onClick={handleLike} className={`flex items-center space-x-2 hover:text-primary transition-colors ${project.is_liked ? 'text-primary' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill={project.is_liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="text-xl">{project.likes_count || 0}</span>
                            </button>
                            <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span className="text-xl">{project.comments ? project.comments.length : 0}</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-[var(--card-bg)] p-8 rounded-xl border border-[var(--border-color)] mb-12 shadow-sm">
                        <h3 className="text-2xl font-bold mb-4 text-[var(--text-color)] uppercase tracking-wide">About this Project</h3>
                        <p className="text-[var(--text-muted)] leading-relaxed whitespace-pre-wrap">
                            {project.description}
                        </p>
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-[var(--border-color)] pt-12">
                        <h3 className="text-2xl font-bold mb-8 uppercase tracking-wide text-[var(--text-color)]">Comments ({project.comments ? project.comments.length : 0})</h3>

                        {user ? (
                            <form onSubmit={handleCommentSubmit} className="mb-12">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="w-full bg-[var(--bg-color)] border border-[var(--border-color)] rounded-lg p-4 text-[var(--text-color)] focus:border-primary focus:ring-1 focus:ring-primary outline-none mb-4"
                                    placeholder="Write a comment..."
                                    rows="4"
                                    required
                                />
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={submitting}>
                                        {submitting ? 'Posting...' : 'Post Comment'}
                                    </Button>
                                </div>
                            </form>
                        ) : (
                            <div className="bg-[var(--card-bg)] p-6 rounded-lg mb-12 text-center border border-[var(--border-color)]">
                                <p className="text-[var(--text-muted)] mb-4">Please login to leave a comment.</p>
                                <Link to="/login" className="text-primary hover:text-secondary font-bold uppercase tracking-wide">Login</Link>
                            </div>
                        )}

                        <div className="space-y-8">
                            {project.comments && project.comments.map((comment) => (
                                <div key={comment.id} className="flex space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-[var(--text-muted)] flex-shrink-0">
                                        {comment.user?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-bold text-[var(--text-color)]">{comment.user?.username || 'User'}</span>
                                            <span className="text-[var(--text-muted)] text-sm">· {new Date(comment.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-[var(--text-muted)]">{comment.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </article>
        </div>
    );
};

export default ProjectDetail;
