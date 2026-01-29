import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Carousel from "../../Other/Carousel/Carousel";
import img1 from "../../../assets/1.png";
import img2 from "../../../assets/2.png";
import img3 from "../../../assets/3.png";
import "./Homepage.css";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
const stats = [
  { value: "99GB", label: "Processed Datasets" },
  { value: "5K+", label: "Automated Models" },
  { value: "2K+", label: "Training Minutes Saved" },
];
export default function HomePage() {
  const navigate = useNavigate();
  const statsContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };
  const statItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  const slides = [
    {
      image: img1,
      text: "Machine Learning",
    },
    {
      image: img2,
      text: "Machine Learning",
    },
    {
      image: img3,
      text: "Machine Learning",
    },
  ];
  return (
    <div className="page">
      {slides.length > 0 && <Carousel slides={slides} />}
      <div className="hero">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h1 variants={itemVariants}>
            Data to Deployment <br />
          </motion.h1>
          <motion.p variants={itemVariants}>
            Upload your datasets and let Al automatically analyze, visualize,
            and generate insights. No coding required - just pure machine
            learning power at your fingertips.
          </motion.p>

          <motion.div className="quick-links" variants={containerVariants}>
            {["Dashboard", "Reports"].map((item) => (
              <motion.a
                key={item}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                className="quick-link"
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        className="hero-stats"
        variants={statsContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            variants={statItem}
            whileHover={{ scale: 1.05 }}
          >
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>
      <div className="hero">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h1 variants={itemVariants}>AutoML</motion.h1>
          <motion.p variants={itemVariants}>
            Automated Data Analysis and Machine Learning Pipeline with
            Generative AI Agents proposes the development of an intelligent
            platform that integrates Generative AI, Large Language Models
            (LLMs), and multi-agent frameworks such as LangGraph to automate the
            complete data science workflow. Generative AI and LLMs are advanced
            systems capable of understanding and generating human-like language,
            making them powerful tools for reasoning, automation, and decision
            support. Retrieval-Augmented Generation (RAG) is incorporated to
            enhance accuracy, retrieving the most relevant information and then
            generating reliable outputs
          </motion.p>
          <motion.div className="quick-links" variants={containerVariants}>
            {["Read More"].map((item) => (
              <motion.a
                key={item}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                className="quick-link"
                variants={itemVariants}
                whileTap={{ scale: 0.97 }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
