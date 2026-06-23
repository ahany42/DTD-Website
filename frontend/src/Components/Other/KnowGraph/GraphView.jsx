import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CircleNode from "../../Other/KnowGraph/CircleNode";

import { Button, Callout } from "@radix-ui/themes";

/* ---------------- NODE TYPES ---------------- */
const nodeTypes = {
  circle: CircleNode,
};

/* ---------------- COMPONENT MAP ---------------- */
const componentMap = {
  eda: { text: "EDA" },
  preprocess: { text: "Preprocessing" },
  feature: { text: "Feature Engineering" },
  selection: { text: "Model Selection" },
  training: { text: "Model Training" },
  evaluation: { text: "Model Evaluation" },

  summary: { text: "Summary" },
  profiles: { text: "Profiles" },
  quality: { text: "Quality" },
  target: { text: "Target" },

  missing: { text: "Missing Values" },
  encoding: { text: "Encoding" },
  scaling: { text: "Scaling" },

  creation: { text: "Creation" },
  task: { text: "Task" },
  models: { text: "Models" },

  load: { text: "Load" },
  train: { text: "Train" },
  leaderboard: { text: "Leaderboard" },

  metrics: { text: "Metrics" },
  shap: { text: "SHAP" },
  report: { text: "Report" },
};

/* ---------------- INNER COMPONENT ---------------- */
function GraphViewInner({
  nodes = [],
  edges = [],
  loading = false,
  error = null,
}) {
  const [activeNodeId, setActiveNodeId] = useState(null);

  const onNodeClick = useCallback((_, node) => {
    const key = node?.id?.toLowerCase();

    if (componentMap[key]) {
      setActiveNodeId(key);
    }
  }, []);

  const activeNode = componentMap?.[activeNodeId] ?? null;

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
      {/* LOADING */}
      {loading && (
        <div style={overlayStyle}>
          <span style={{ color: "#94a3b8" }}>Loading graph...</span>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div style={overlayStyle}>
          <span style={{ color: "#ef4444" }}>
            Failed to load graph: {String(error)}
          </span>
        </div>
      )}

      {/* ---------------- GRAPH MODE ---------------- */}
      {!activeNodeId && (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.4 }}
          minZoom={0.5}
          maxZoom={4}
        >
          <Background color="#cbd5e1" gap={20} />

          <Controls
            position="top-right"
            showZoom
            showFitView
            showInteractive
            style={{
              position: "absolute",
              zIndex: 1000,
              background: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        </ReactFlow>
      )}

      {/* ---------------- DETAIL MODE ---------------- */}
      {activeNodeId && (
        <div>
          <Button onClick={() => setActiveNodeId(null)} size="2" variant="soft">
            Back to Full Pipeline
          </Button>

          <h4
            style={{
              textAlign: "center",
              color: "var(--primary-color)",
              margin: "0",
            }}
          >
            {activeNode?.text}
          </h4>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Callout.Root>
              <Callout.Text>
                Detail view is available for {activeNode?.text}.
              </Callout.Text>
            </Callout.Root>
          </div>
        </div>
      )}

      {/* ---------------- STYLES ---------------- */}
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
          stroke: #000000 !important;
        }

        .react-flow__controls-button:hover {
          background: #f3f4f6 !important;
        }
      `}</style>
    </div>
  );
}

/* ---------------- OVERLAY STYLE ---------------- */
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

/* ---------------- EXPORT WRAPPER ---------------- */
export default function GraphView(props) {
  return (
    <ReactFlowProvider>
      <GraphViewInner {...props} />
    </ReactFlowProvider>
  );
}
