import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Projects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8000/projects/');
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
                // Fallback data for demo if backend is not running
                setProjects([
                    { id: 1, title: 'Portfolio Website', description: 'This website built with React and FastAPI', image_url: 'https://via.placeholder.com/400x200' },
                    { id: 2, title: 'E-commerce App', description: 'A full stack e-commerce application', image_url: 'https://via.placeholder.com/400x200' },
                ]);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-center mb-12 uppercase tracking-wide text-[var(--text-color)]"
                >
                    My Projects
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[var(--card-bg)] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-[var(--border-color)] flex flex-col backdrop-blur-sm"
                        >
                            <div className="h-48 bg-gray-800 overflow-hidden relative group">
                                {project.image_url && <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Link to={`/projects/${project.id}`} className="bg-primary text-dark px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold mb-2 text-[var(--text-color)]">{project.title}</h3>
                                <p className="text-[var(--text-muted)] mb-4 flex-grow line-clamp-3">{project.description}</p>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--border-color)]">
                                    <div className="flex space-x-4">
                                        {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-color)] transition-colors"><i className="fab fa-github text-xl"></i></a>}
                                        {project.project_url && <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-primary transition-colors"><i className="fas fa-external-link-alt text-xl"></i></a>}
                                    </div>
                                    <Link to={`/projects/${project.id}`} className="text-primary hover:text-secondary text-sm font-bold uppercase tracking-wider">
                                        Read More →
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
