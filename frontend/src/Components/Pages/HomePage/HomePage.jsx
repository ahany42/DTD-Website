import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Carousel from "../../Other/Carousel/Carousel";
import img1 from "../../../assets/1.png";
import img2 from "../../../assets/2.png";
import img3 from "../../../assets/3.png";
import "./Homepage.css";
import { AppContext } from "../../../App";
import { toast } from "react-toastify";
import { TextField, TextArea } from "@radix-ui/themes";

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
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export default function HomePage() {
  const navigate = useNavigate();
  const { BACKEND_URL } = useContext(AppContext);

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        toast.error("Message Not Received Please Try Again Later");
      }

      toast.success("Thank You , We Have Received Your Message");

      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const slides = [
    { image: img1, text: "Machine Learning" },
    { image: img2, text: "Machine Learning" },
    { image: img3, text: "Machine Learning" },
  ];

  const statsContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const statItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.1, ease: "easeOut" },
    },
  };
  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch(`${BACKEND_URL}/api/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    };
    fetchStats();
  }, [BACKEND_URL]);
  return (
    <div className="page">
      {slides.length > 0 && <Carousel slides={slides} />}

      <div className="hero">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25 }}
        >
          <motion.h1 variants={itemVariants}>Data to Deployment</motion.h1>
          <motion.p variants={itemVariants}>
            Upload your datasets and let AI automatically analyze, visualize,
            and generate insights. No coding required - just pure machine
            learning power at your fingertips.
          </motion.p>

          <motion.div className="quick-links" variants={containerVariants}>
            {["Get Started", "Reports"].map((item) => (
              <motion.a
                key={item}
                onClick={() =>
                  navigate(`/${item.toLowerCase().replace(/\s+/g, "-")}`)
                }
                className="quick-link"
                variants={itemVariants}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="hero-stats hero">
        {stats &&
          stats.map((stat) => (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              key={stat.label}
              className="stat-card"
            >
              <span className="stat-value">
                {stat.label === "Run Time Minutes"
                  ? `${Number(stat.value).toFixed(2)}`
                  : stat.value}
              </span>
              <span className="stat-label">{stat.label}</span>
            </motion.div>
          ))}
      </div>

      <div className="hero">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25 }}
        >
          <motion.h1 variants={itemVariants}>AutoML</motion.h1>
          <motion.p variants={itemVariants}>
            Turn your data into insights in minutes with a fast, intelligent
            platform. Everything is handled for you—from data to results—so you
            can focus on decisions. Upload your dataset, describe your goal, and
            get results in about two minutes.
          </motion.p>
          <motion.div className="quick-links" variants={containerVariants}>
            <motion.a
              onClick={() => navigate(`/read-more`)}
              className="quick-link"
              variants={itemVariants}
            >
              Read More
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      <div className="hero">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.25 }}
        >
          <motion.h1 variants={itemVariants}>Reach US</motion.h1>
          <motion.form className="contact-form" onSubmit={handleSubmit}>
            <motion.div
              variants={itemVariants}
              className="input-label-container"
            >
              <motion.label>Name</motion.label>
              <TextField.Root
                color="teal"
                variant="outline"
                size="3"
                name="name"
                required
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="input-label-container"
            >
              <motion.label>Email</motion.label>
              <TextField.Root
                color="teal"
                variant="outline"
                size="3"
                name="email"
                type="email"
                required
                placeholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="input-label-container"
            >
              <motion.label>Message</motion.label>
              <TextArea
                color="teal"
                variant="outline"
                size="3"
                name="message"
                required
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
              />
            </motion.div>

            <motion.div className="quick-links" variants={containerVariants}>
              <motion.button
                type="submit"
                className="quick-link"
                variants={itemVariants}
                disabled={loading}
              >
                {loading ? "Sending..." : "Submit"}
              </motion.button>
            </motion.div>

            {success && <p style={{ color: "green" }}>{success}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
}
