import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CircleNode from "../../Other/KnowGraph/CircleNode";
import EDAGraphPage from "../../Pages/KnowledgeGraph/EDAGraphPage";
import Preprocessing from "../../Pages/KnowledgeGraph/PreprocessingGraph";
import Feature from "../../Pages/KnowledgeGraph/FeatureEngineeringGraph";
import Selection from "../../Pages/KnowledgeGraph/ModelSelectionGraph";
import Training from "../../Pages/KnowledgeGraph/ModelTrainGraph";
import Evaluation from "../../Pages/KnowledgeGraph/EvaluationGraphPage";
import { Button } from "@radix-ui/themes";

const nodeTypes = {
  circle: CircleNode,
};

const componentMap = {
  eda: { component: EDAGraphPage, text: "EDA" },
  preprocess: { component: Preprocessing, text: "Preprocessing" },
  feature: { component: Feature, text: "Feature Engineering" },
  selection: { component: Selection, text: "Model Selection" },
  training: { component: Training, text: "Model Training" },
  evaluation: { component: Evaluation, text: "Model Evaluation" },

  summary: { component: null, text: "Summary" },
  profiles: { component: null, text: "Profiles" },
  quality: { component: null, text: "Quality" },
  target: { component: null, text: "Target" },

  missing: { component: null, text: "Missing Values" },
  encoding: { component: null, text: "Encoding" },
  scaling: { component: null, text: "Scaling" },

  creation: { component: null, text: "Creation" },

  task: { component: null, text: "Task" },
  models: { component: null, text: "Models" },

  load: { component: null, text: "Load" },
  train: { component: null, text: "Train" },
  leaderboard: { component: null, text: "Leaderboard" },

  metrics: { component: null, text: "Metrics" },
  shap: { component: null, text: "SHAP" },
  report: { component: null, text: "Report" },
};

function GraphViewInner({
  nodes = [],
  edges = [],
  loading = false,
  error = null,
}) {
  const [activeNodeId, setActiveNodeId] = useState(null);

  const onNodeClick = useCallback((_, node) => {
    if (componentMap[node.id] !== undefined) {
      setActiveNodeId(node.id);
    }
  }, []);

  const ActiveComponent =
    activeNodeId && componentMap[activeNodeId].component
      ? componentMap[activeNodeId].component
      : null;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "60vh",
        backgroundColor: "#fafcff",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {loading && (
        <div style={overlayStyle}>
          <span style={{ color: "#94a3b8" }}>Loading graph...</span>
        </div>
      )}

      {!loading && error && (
        <div style={overlayStyle}>
          <span style={{ color: "#ef4444" }}>
            Failed to load graph: {String(error)}
          </span>
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.4 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background color="#cbd5e1" gap={20} />

        <Controls
          position="bottom-right"
          showZoom
          showFitView
          showInteractive
          style={{
            background: "#fff",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />
      </ReactFlow>
      <h1 className="sub-header">Pipeline</h1>
      {ActiveComponent && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            background: "rgba(250, 252, 255, 0.96)",
            overflow: "auto",
          }}
        >
          <Button onClick={() => setActiveNodeId(null)} size="2" variant="soft">
            Back to Full Pipeline
          </Button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <h1 className="sub-header">{componentMap[activeNodeId].text}</h1>
            <ActiveComponent />
          </div>
        </div>
      )}

      <style>{`
        .react-flow__controls {
          z-index: 9999 !important;
        }

        .react-flow__controls-button {
          background: #ffffff !important;
          border-bottom: 1px solid #e5e7eb !important;
          color: #000000 !important;
        }

        .react-flow__controls-button svg {
          fill: #000000 !important;
          color: #000000 !important;
          stroke: #000000 !important;
        }

        .react-flow__controls-button:hover {
          background: #f3f4f6 !important;
        }
      `}</style>
    </div>
  );
}

const overlayStyle = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  pointerEvents: "none",
  fontFamily: "system-ui, sans-serif",
  fontSize: "14px",
};

export default function GraphView(props) {
  return (
    <ReactFlowProvider>
      <GraphViewInner {...props} />
    </ReactFlowProvider>
  );
}
