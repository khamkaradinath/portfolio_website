import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 bg-[var(--bg-color)] text-[var(--text-color)] transition-colors duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-8 uppercase tracking-wide text-[var(--text-color)]">About Me</h1>

                <div className="bg-[var(--card-bg)] p-8 rounded-lg shadow-sm border border-[var(--border-color)] backdrop-blur-sm">
                    <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-6">
                        I'm a <span className="text-primary font-semibold">Machine Learning Engineer</span> with strong experience in <span className="text-primary font-semibold">Generative AI</span>, <span className="text-primary font-semibold">Computer Vision</span>, and real-time object detection systems. I design, train, and deploy AI models across cloud platforms, GPU servers, and edge-based hardware such as NVIDIA Jetson, Raspberry Pi 5, and Coral Edge TPU.
                    </p>
                    <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-6">
                        My work spans end-to-end ML pipelines: data processing, model development, optimization (TensorRT, quantization), API design, and deployment using FastAPI, WebSockets, and modern DevOps tools. I specialize in solving performance-critical challenges, including low-latency streaming, efficient inference, and running AI in resource-constrained environments.
                    </p>
                    <p className="text-lg text-[var(--text-muted)] leading-relaxed mb-6">
                        I'm passionate about building <span className="text-primary font-semibold">practical AI systems that make an impact</span> — from prototype to production.
                    </p>

                    <h2 className="text-2xl font-bold mb-4 mt-8 uppercase tracking-wide text-primary">Core Expertise</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[var(--text-muted)] mb-8">
                        <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Generative AI & LLMs</li>
                        <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Computer Vision</li>
                        <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Real-time Object Detection</li>
                        <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Model Optimization (TensorRT)</li>
                        <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Edge AI Deployment</li>
                        <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Low-latency Inference</li>
                    </ul>

                    <h2 className="text-2xl font-bold mb-4 mt-8 uppercase tracking-wide text-primary">Technologies & Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-[var(--text-color)]">ML & AI</h3>
                            <ul className="space-y-2 text-[var(--text-muted)]">
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>PyTorch & TensorFlow</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>YOLO, OpenCV</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Hugging Face Transformers</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>TensorRT & Quantization</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-[var(--text-color)]">Edge Hardware</h3>
                            <ul className="space-y-2 text-[var(--text-muted)]">
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>NVIDIA Jetson</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Raspberry Pi 5</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Coral Edge TPU</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>GPU Servers (CUDA)</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-[var(--text-color)]">Backend & APIs</h3>
                            <ul className="space-y-2 text-[var(--text-muted)]">
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Python & FastAPI</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>WebSockets</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>REST APIs</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>PostgreSQL & MongoDB</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-[var(--text-color)]">DevOps & Cloud</h3>
                            <ul className="space-y-2 text-[var(--text-muted)]">
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Docker & Kubernetes</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>AWS & GCP</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>CI/CD Pipelines</li>
                                <li className="flex items-center"><span className="w-2 h-2 bg-primary rounded-full mr-3"></span>Git & GitHub</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default About;
