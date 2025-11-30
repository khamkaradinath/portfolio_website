import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden bg-[var(--bg-color)] transition-colors duration-300">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-[var(--text-color)] uppercase"
                >
                    HEY, I'M ADINATH KHAMKAR
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl text-[var(--text-muted)] mb-12 max-w-2xl mx-auto leading-relaxed"
                >
                    A Machine Learning Engineer specializing in Generative AI, Computer Vision, and Edge AI — building intelligent systems from prototype to production
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col items-center space-y-8"
                >
                    <Link to="/projects">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-primary text-black font-bold py-4 px-12 rounded shadow-lg hover:shadow-primary/50 transition-all duration-300 text-lg tracking-wider uppercase"
                        >
                            PROJECTS
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Social Icons - Fixed to bottom left */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="fixed bottom-10 left-10 flex flex-col space-y-4 z-50"
                >
                    <a href="https://www.linkedin.com/in/adukhamkar/" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-primary transition-colors">
                        <FaLinkedin size={24} />
                    </a>
                    <a href="https://x.com/KhamkarAdinath" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-primary transition-colors">
                        <FaTwitter size={24} />
                    </a>
                    <a href="https://github.com/khamkaradinath" target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-primary transition-colors">
                        <FaGithub size={24} />
                    </a>
                    <div className="w-0.5 h-20 bg-[var(--text-muted)] mx-auto"></div>
                </motion.div>
            </main>
        </div>
    );
};

export default Home;
