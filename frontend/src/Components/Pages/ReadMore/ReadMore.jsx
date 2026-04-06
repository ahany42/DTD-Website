import { motion } from "framer-motion";
const ReadMore = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  return (
    <div className="page">
      <div className="readme-div">
        <h1 variants={itemVariants}>Data to Deployment (DTD)</h1>
        <p variants={itemVariants}>
          Turn your data into insights in minutes. Our intelligent platform
          handles everything—from understanding your request and preparing your
          data to selecting the right model and delivering clear, actionable
          results. Simply upload your dataset, describe what you need, and let
          the system do the rest with speed, accuracy, and ease.
        </p>
      </div>
      <div className="readme-div">
        <h1 variants={itemVariants}>Importance of ML</h1>
        <p variants={itemVariants}>
          Machine learning has become an essential component in modern
          applications, contributing to innovation in fields such as medicine,
          finance, cybersecurity, and many more. In today's digital era, where
          data is the backbone of decision-making and innovation, machine
          learning is widely used in various fields around the world. It is
          estimated that organizations now generate hundreds of millions of
          terabytes of data every day, and yet the process of preparing data,
          choosing models, and analyzing results remains complex and
          time-consuming, often requiring expert knowledge. Automated Machine
          Learning (AutoML) frameworks such as Auto-sklearn, AutoGluon, and
          H2O.ai have made progress in automating tasks such as model selection
          and hyperparameter tuning, yet they fall short in addressing other
          critical phases
        </p>
      </div>
      <div className="readme-div">
        <h1 variants={itemVariants}>Why AutoML</h1>
        <p variants={itemVariants}>
          Developing machine learning solutions still requires significant
          manual effort in selecting algorithms, engineering features, and
          tuning hyperparameters. While existing AutoML tools automate parts of
          this workflow, they remain fragmented and often demand expert
          knowledge to configure and interpret. This creates long
          experimentation cycles and steep learning curves for most developers,
          and especially for users without prior ML experience. Meanwhile, the
          space of potential model architectures, preprocessing techniques, and
          parameter combinations has grown exponentially, making manual
          exploration both impractical and time-consuming, diverting effort away
          from innovation and deployment. Managing data further intensifies
          these challenges. Traditional data exploration methods are slow,
          error-prone, and resource-intensive, ultimately delaying the
          extraction of actionable insights and hindering timely
          decision-making. While existing AutoML frameworks have attempted to
          simplify parts of this workflow, they are limited in two major ways:
          They typically optimize model selection and tuning, while leaving
          critical steps like data cleaning, feature extraction, and
          interpretability largely manual. They operate as black boxes,
          providing results without clearly explaining why certain choices were
          made. To overcome these bottlenecks, our project proposes a fully
          automated end-to-end ML pipeline, extending beyond data analysis to
          encompass dataset ingestion, model development, and deployment. The
          system aims to reduce the technical burden on users, streamline data
          exploration, and accelerate experimentation. This enables developers
          to focus on higher-level innovation while empowering non-expert users
          to rapidly generate accurate, high-performing solutions without
          requiring deep ML expertise.
        </p>
      </div>
      <div className="readme-div">
        <h1 variants={itemVariants}>Our Objective</h1>
        <p variants={itemVariants}>
          The primary objective of our project is to design and develop an
          adaptive machine learning system enhanced by Large Language Models
          (LLMs) and AI agents to support both novice and expert users in
          building machine learning solutions. The system seeks to balance
          automation with prompt-driven customization, while ensuring
          adaptability across diverse datasets
        </p>
      </div>
    </div>
  );
};

export default ReadMore;
