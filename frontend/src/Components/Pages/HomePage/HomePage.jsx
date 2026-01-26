import { motion } from "framer-motion";
import Carousel from "../../Other/Carousel/Carousel";
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
      image:
        "https://advertisingupdates.com/wp-content/uploads/2025/12/Machine-Learning.jpg",
      text: "Machine Learning",
    },
    {
      image:
        "https://advertisingupdates.com/wp-content/uploads/2025/12/Machine-Learning.jpg",
      text: "Machine Learning",
    },
    {
      image:
        "https://advertisingupdates.com/wp-content/uploads/2025/12/Machine-Learning.jpg",
      text: "Machine Learning",
    },
  ];
  return (
    <div className="page">
      {slides.length > 0 && <Carousel slides={slides} />}
      <section className="hero">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.h1 variants={itemVariants}>AutoML Platform</motion.h1>
          <motion.p variants={itemVariants}>
            Upload your datasets and let Al automatically analyze, visualize,
            and generate insights. No coding required - just pure machine
            learning power at your fingertips.
          </motion.p>

          <motion.div className="quick-links" variants={containerVariants}>
            {["Docs", "Dashboard", "Reports"].map((item) => (
              <motion.a
                key={item}
                href="#"
                className="quick-link"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </section>
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
    </div>
  );
}
