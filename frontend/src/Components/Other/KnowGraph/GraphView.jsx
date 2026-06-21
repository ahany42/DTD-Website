import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ReactFlow, Background, Controls, ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CircleNode from "../../Other/KnowGraph/CircleNode";

const nodeTypes = {
  circle: CircleNode,
};

// Covers node ids across every graphType branch in graphBuilder.js
// (default, eda, preprocessing, feature_engineering, model_selection,
// training, evaluation). Extend here if you add a new graph type.
const routeMap = {
  // default pipeline
  eda: "/eda-graph",
  preprocess: "/preprocess-graph",
  feature: "/feature-engineering-graph",
  selection: "/model-selection-graph",
  training: "/training-graph",
  evaluation: "/evaluation-graph",

  // eda
  summary: "/eda-graph",
  profiles: "/preprocess-graph",
  quality: "/eda-graph",
  target: "/model-selection-graph",

  // preprocessing
  missing: "/preprocess-graph",
  encoding: "/preprocess-graph",
  scaling: "/preprocess-graph",

  // feature_engineering
  creation: "/feature-engineering-graph",

  // model_selection
  task: "/model-selection-graph",
  models: "/model-selection-graph",

  // training
  load: "/training-graph",
  train: "/training-graph",
  leaderboard: "/training-graph",

  // evaluation
  metrics: "/evaluation-graph",
  shap: "/evaluation-graph",
  report: "/evaluation-graph",
};

function GraphViewInner({ nodes = [], edges = [], loading = false, error = null }) {
  const navigate = useNavigate();

  const onNodeClick = useCallback(
    (_, node) => {
      const path = routeMap[node.id];
      if (path) navigate(path);
    },
    [navigate]
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        inset: 0,
        backgroundColor: "#fafcff",
      }}
    >
      {loading && (
        <div style={overlayStyle}>
          <span style={{ color: "#94a3b8" }}>Loading graph…</span>
        </div>
      )}
      {!loading && error && (
        <div style={overlayStyle}>
          <span style={{ color: "#f87171" }}>Failed to load graph: {String(error)}</span>
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.4, duration: 0 }}
        minZoom={0.1}
        maxZoom={2}
      >
        <Background color="#334155" gap={20} />
        <Controls />
      </ReactFlow>
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
