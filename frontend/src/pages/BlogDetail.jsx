import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const BlogDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/blog/${id}`);
                setBlog(response.data);
            } catch (error) {
                console.error('Error fetching blog:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id]);

    const handleLike = async () => {
        if (!user) {
            alert("Please login to like this post");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8000/blog/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBlog({ ...blog, claps: response.data.likes_count });
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
            const response = await axios.post(`http://localhost:8000/blog/${id}/comment`, {
                content: comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Add new comment to the list
            const newComment = { ...response.data, user: { username: user.sub } }; // Optimistic update or response structure
            setBlog({ ...blog, comments: [...(blog.comments || []), newComment] });
            setComment('');
        } catch (error) {
            console.error('Error commenting:', error);
            alert('Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center text-white">Loading...</div>;
    if (!blog) return <div className="min-h-screen pt-24 text-center text-white">Blog not found</div>;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
            <article className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-[var(--text-color)] leading-tight">
                        {blog.title}
                    </h1>
                    {blog.subtitle && (
                        <h2 className="text-xl md:text-2xl text-[var(--text-muted)] font-serif mb-8 leading-snug">
                            {blog.subtitle}
                        </h2>
                    )}

                    <div className="flex items-center space-x-4 mb-8 border-b border-[var(--border-color)] pb-8">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xl font-bold text-[var(--text-muted)]">
                            A
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-[var(--text-muted)]">Adina</span>
                                <span className="text-[var(--text-muted)]">·</span>
                                <span className="text-primary cursor-pointer hover:text-primary/80">Follow</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-[var(--text-muted)]">
                                <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                <span>·</span>
                                <span>{blog.reading_time || 1} min read</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-y border-[var(--border-color)] py-4 mb-8">
                        <div className="flex items-center space-x-6 text-[var(--text-muted)]">
                            <button onClick={handleLike} className={`flex items-center space-x-2 hover:text-primary transition-colors ${blog.is_liked ? 'text-primary' : ''}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={blog.is_liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                </svg>
                                <span>{blog.claps || 0}</span>
                            </button>
                            <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{blog.comments ? blog.comments.length : 0}</span>
                            </button>
                        </div>
                    </div>

                    {blog.image_url && (
                        <div className="mb-10">
                            <img
                                src={blog.image_url}
                                alt={blog.title}
                                className="w-full h-auto rounded-lg border border-[var(--border-color)]"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg max-w-none font-serif text-[var(--text-muted)] leading-relaxed mb-12">
                        {blog.content.split('\n').map((paragraph, index) => (
                            <p key={index} className="mb-6">{paragraph}</p>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-12">
                        {blog.tags && blog.tags.map(tag => (
                            <span key={tag.id} className="bg-[var(--card-bg)] px-4 py-2 rounded-full text-sm text-[var(--text-muted)] border border-[var(--border-color)] hover:bg-[var(--border-color)] cursor-pointer transition-colors">
                                {tag.name}
                            </span>
                        ))}
                    </div>

                    {/* Comments Section */}
                    <div className="border-t border-[var(--border-color)] pt-12">
                        <h3 className="text-2xl font-bold mb-8">Comments ({blog.comments ? blog.comments.length : 0})</h3>

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
                                <Link to="/login" className="text-primary hover:text-secondary font-medium">Login</Link>
                            </div>
                        )}

                        <div className="space-y-8">
                            {blog.comments && blog.comments.map((comment) => (
                                <div key={comment.id} className="flex space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-[var(--text-muted)] flex-shrink-0">
                                        {comment.user?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <span className="font-medium text-[var(--text-color)]">{comment.user?.username || 'User'}</span>
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

export default BlogDetail;
