export const buildGraph = (graphType = "main") => {
  switch (graphType) {
    case "eda":
      return {
        nodes: [
          {
            id: "profiles",
            position: { x: 350, y: 100 },
            data: { label: "Column Profiles" },
            type: "circle",
          },
          {
            id: "quality",
            position: { x: 600, y: 100 },
            data: { label: "Data Quality Report" },
            type: "circle",
          },
          {
            id: "target",
            position: { x: 850, y: 100 },
            data: { label: "Target Analysis" },
            type: "circle",
          },
        ],
        edges: [
          { id: "e1", source: "profiles", target: "quality" },
          { id: "e2", source: "quality", target: "target" },
        ],
      };

    case "preprocessing":
      return {
        nodes: [
          {
            id: "missing",
            position: { x: 100, y: 100 },
            data: { label: "Missing Values" },
            type: "circle",
          },
          {
            id: "encoding",
            position: { x: 350, y: 100 },
            data: { label: "Encoding" },
            type: "circle",
          },
          {
            id: "scaling",
            position: { x: 600, y: 100 },
            data: { label: "Scaling" },
            type: "circle",
          },
        ],
        edges: [
          { id: "e1", source: "missing", target: "encoding" },
          { id: "e2", source: "encoding", target: "scaling" },
        ],
      };

    case "feature_engineering":
      return {
        nodes: [
          {
            id: "creation",
            position: { x: 100, y: 100 },
            data: { label: "Feature Creation" },
            type: "circle",
          },
          {
            id: "selection",
            position: { x: 350, y: 100 },
            data: { label: "Feature Selection" },
            type: "circle",
          },
        ],
        edges: [
          { id: "e1", source: "creation", target: "selection" },
        ],
      };

    case "model_selection":
      return {
        nodes: [
          {
            id: "task",
            position: { x: 100, y: 100 },
            data: { label: "Task Detection" },
            type: "circle",
          },
          {
            id: "models",
            position: { x: 350, y: 100 },
            data: { label: "Candidate Models" },
            type: "circle",
          },
        ],
        edges: [
          { id: "e1", source: "task", target: "models" },
        ],
      };

    case "training":
      return {
        nodes: [
          {
            id: "load",
            position: { x: 100, y: 100 },
            data: { label: "Data Loading" },
            type: "circle",
          },
          {
            id: "train",
            position: { x: 350, y: 100 },
            data: { label: "Training" },
            type: "circle",
          },
          {
            id: "leaderboard",
            position: { x: 600, y: 100 },
            data: { label: "Leaderboard" },
            type: "circle",
          },
        ],
        edges: [
          { id: "e1", source: "load", target: "train" },
          { id: "e2", source: "train", target: "leaderboard" },
        ],
      };

    case "evaluation":
      return {
        nodes: [
          {
            id: "metrics",
            position: { x: 100, y: 100 },
            data: { label: "Metrics" },
            type: "circle",
          },
          {
            id: "shap",
            position: { x: 350, y: 100 },
            data: { label: "SHAP Analysis" },
            type: "circle",
          },
          {
            id: "report",
            position: { x: 600, y: 100 },
            data: { label: "Final Report" },
            type: "circle",
          },
        ],
        edges: [
          { id: "e1", source: "metrics", target: "shap" },
          { id: "e2", source: "shap", target: "report" },
        ],
      };

    default:
      return {
        nodes: [
          {
            id: "eda",
            position: { x: 100, y: 100 },
            data: { label: "EDA" },
            type: "circle",
          },
          {
            id: "preprocess",
            position: { x: 350, y: 100 },
            data: { label: "Preprocessing" },
            type: "circle",
          },
          {
            id: "feature",
            position: { x: 600, y: 100 },
            data: { label: "Feature Engineering" },
            type: "circle",
          },
          {
            id: "selection",
            position: { x: 850, y: 100 },
            data: { label: "Model Selection" },
            type: "circle",
          },
          {
            id: "training",
            position: { x: 1100, y: 100 },
            data: { label: "Training" },
            type: "circle",
          },
          {
            id: "evaluation",
            position: { x: 1350, y: 100 },
            data: { label: "Evaluation" },
            type: "circle",
          },
        ],
        edges: [
          { id: "e1", source: "eda", target: "preprocess" },
          { id: "e2", source: "preprocess", target: "feature" },
          { id: "e3", source: "feature", target: "selection" },
          { id: "e4", source: "selection", target: "training" },
          { id: "e5", source: "training", target: "evaluation" },
        ],
      };
  }
};