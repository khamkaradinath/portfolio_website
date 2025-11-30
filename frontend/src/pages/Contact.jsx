import { motion } from 'framer-motion';
import Button from '../components/Button';

const Contact = () => {
    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-wide text-[var(--text-color)]">Contact</h1>

                <div className="bg-[var(--card-bg)] p-8 rounded-lg shadow-sm border border-[var(--border-color)] backdrop-blur-sm">
                    <p className="text-lg text-[var(--text-muted)] mb-8">
                        I'm currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!
                    </p>

                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-3 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[var(--text-color)]"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-3 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[var(--text-color)]"
                                placeholder="your.email@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Message</label>
                            <textarea
                                id="message"
                                rows="5"
                                className="w-full px-4 py-3 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[var(--text-color)]"
                                placeholder="Hello, I'd like to talk about..."
                            ></textarea>
                        </div>
                        <Button className="w-full md:w-auto">Send Message</Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;
