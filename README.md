# 📊 Dynamic Pipeline Platform (React + Vite)

A modern web-based platform for building, visualizing, and managing end-to-end machine learning pipelines.
It supports interactive pipeline stages, reporting, knowledge graphs, and admin management features.

# 🚀 Features

## 🧠 Dynamic ML Pipeline Builder

- Preprocessing
- EDA (Exploratory Data Analysis)
- Feature Engineering
- Model Selection
- Training
- Evaluation
- Deployment

## 📊 Visualization Tools

- Pipeline step visualization
- Charts and metrics (Recharts)
- Knowledge Graph view

## 📁 Dataset Management

- Upload datasets
- View processed results
- Report generation

## 🔐 Authentication System

- Login / Signup
- Password reset / forgot password

## 🧑‍💼 Admin Dashboard

- Manage users
- View reports
- Handle complaints

## 💬 Communication

- Messages module
- Chat widget support

## 🏗️ Project Structure

```text
src/
├── Components/
│   ├── Hooks/ # Custom React hooks
│   ├── Other/
│   │   ├── CardsCarousel/
│   │   ├── Carousel/
│   │   ├── ChatWidget/
│   │   ├── KnowledgeGraph/
│   │   ├── Loader/
│   │   ├── Pagination/
│   │   ├── ReportStepper/
│   │   └── Visualization/
│   ├── Pages/
│   │   ├── HomePage/
│   │   ├── Login/
│   │   ├── SignUp/
│   │   ├── UploadDataset/
│   │   ├── Reports/
│   │   ├── ViewReport/
│   │   ├── KnowledgeGraph/
│   │   ├── Dynamic/ # Main pipeline flow
│   │   │   ├── DynamicPreprocessing/
│   │   │   ├── DynamicEda/
│   │   │   ├── DynamicFeatureEngineering/
│   │   │   ├── DynamicModelSelection/
│   │   │   ├── DynamicTraining/
│   │   │   ├── DynamicEvaluation/
│   │   │   └── DynamicDeployment/
│   │   ├── AdminUsers/
│   │   ├── AdminReports/
│   │   └── AdminComplaints/
│   └── Sections/
│       ├── NavBar/
│       ├── SideBar/
│       └── Footer/
├── Layouts/
└── assets/
└── dynamic_pipeline/
└── (generated pipeline visualizations)
```

## 📌 Tech Stack

- React
- Vite
- Redux
- React Flow
- Recharts
- Radix
- Mongo
- Express

## ⚙️ Environment Setup

Use `env.example` as a sample file to create your local `.env` file before starting the app.

```bash
cp env.example .env
```

## 🤖 AI Server

Run the AI server with `api.py`:

```bash
python api.py
```

## 🔗 Repository Links

- Frontend / Backend: https://github.com/ahany42/DTD-Website
- AI server: https://github.com/ahany42/DTD-Automl

## 🧩 Core Idea

This platform automates and visualizes the full ML lifecycle, making it easier to:

- Build pipelines step-by-step
- Track model performance
- Visualize transformations
- Deploy models efficiently
