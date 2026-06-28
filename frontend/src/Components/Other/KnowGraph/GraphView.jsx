/**
 * GraphView.jsx
 *
 * Renders the ReactFlow knowledge graph.
 * Preserves existing level-1 → level-2 → level-3 drill-down behaviour.
 *
 * HITL additions (custom pipeline mode):
 *   - Colours nodes by status: completed (green) / active (blue, spinner) /
 *     paused (orange) / pending (gray)
 *   - Every node is clickable at all times — drilling into a sub-graph
 *     works regardless of status, including while it is actively executing
 *     or paused. Sub-node status (pending/running/completed) is passed
 *     down via `agentOutputs` so deeper levels can reflect live progress.
 *   - HITLPanel renders as a dedicated full-width drawer BELOW the graph
 *     (not overlapping, not squeezing it) whenever the pipeline is paused —
 *     this is independent of whatever node the user currently has open, so
 *     the user can keep navigating the graph while a decision is pending.
 *   - All HITL props are optional — when not supplied the component works
 *     exactly as before (backward-compatible), minus the old behaviour of
 *     blocking drill-down on non-completed nodes (now always allowed).
 */

import { useCallback, useState, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import CircleNode from "./CircleNode";
import HITLPanel from "./HITLPanel";
import "./GraphView.css";

import { Button } from "@radix-ui/themes";
import KnowledgeGraph from "../../Pages/KnowledgeGraph/KnowledgeGraph";

/* ── Node types ──────────────────────────────────────────────────────── */
const nodeTypes = { circle: CircleNode };

/* ── Pipeline order (for deriving pending/active/completed) ──────────── */
const PIPELINE_ORDER = [
  "eda",
  "preprocessing",
  "feature_engineering",
  "model_selection",
  "training",
  "evaluation",
  "deployment",
];

/* ── Human-readable labels for level-1 nodes ─────────────────────────── */
const COMPONENT_LABELS = {
  eda: "EDA",
  preprocessing: "Preprocessing",
  feature_engineering: "Feature Engineering",
  model_selection: "Model Selection",
  training: "Model Training",
  evaluation: "Model Evaluation",
  deployment: "Deployment",
};

/* ── Inner component ──────────────────────────────────────────────────── */
function GraphViewInner({
  nodes = [],
  edges = [],
  loading = false,
  reportId,
  level = "1",
  parentNode = null,
  error = null,
  /* Legacy props kept for backward-compat with existing non-HITL usage */
  dynamicComponentMap = {},
  currentDynamicReport = null,
  setCurrentDynamicReport = () => {},
  /* HITL props (optional — only passed from ViewReport in custom mode) */
  hitlState = null, // { status, pausedAt, activeAgent, agentOutputs, completedAgents, runId }
  onAccept = null,
  onFeedback = null,
  resuming = false,
}) {
  const [activeNodeId, setActiveNodeId] = useState(null);

  /* Drawer is driven purely by pipeline status — not by which node is
     currently open. This is what keeps it from ever overlapping the
     graph/subgraph area: it's a separate row, always. */
  const isPaused = hitlState?.status === "paused";

  /* ── Build node status map from hitlState ─────────────────────────── */
  const nodeStatusMap = useMemo(() => {
    if (!hitlState) return {};
    const map = {};
    const { pausedAt, activeAgent, completedAgents = [], status } = hitlState;

    PIPELINE_ORDER.forEach((key) => {
      if (completedAgents.includes(key)) {
        map[key] = "completed";
      } else if (key === pausedAt && status === "paused") {
        map[key] = "paused";
      } else if (key === activeAgent) {
        map[key] = "active";
      } else {
        map[key] = "pending";
      }
    });
    return map;
  }, [hitlState]);

  /* ── Inject statuses into nodes ───────────────────────────────────── */
  const enrichedNodes = useMemo(() => {
    if (!hitlState || nodes.length === 0) return nodes;
    return nodes.map((n) => {
      const key = n.id?.toLowerCase();
      const status = nodeStatusMap[key] ?? "default";
      return { ...n, data: { ...n.data, status } };
    });
  }, [nodes, nodeStatusMap, hitlState]);

  /* ── Click handler ────────────────────────────────────────────────── */
  /* Every node is drillable regardless of status (pending / active /
     paused / completed) — the user should always be able to inspect any
     node's sub-nodes and watch them update live. The HITL drawer is
     entirely decoupled from this: it shows/hides based on hitlState.status
     alone, so opening a sub-graph never closes or hides it. */
  const onNodeClick = useCallback(
    (_, node) => {
      const key = node?.id?.toLowerCase();
      setCurrentDynamicReport(key);
      setActiveNodeId(key);
    },
    [setCurrentDynamicReport]
  );

  /* ── HITL panel callbacks ─────────────────────────────────────────── */
  /* Accepting/submitting feedback does NOT touch activeNodeId — the user's
     place in the graph/subgraph navigation is left exactly where it was.
     The drawer disappears as soon as hitlState.status flips away from
     "paused" (handled by the parent updating hitlState after the API call
     resolves), at which point the node should move to "active" with the
     spinner overlay to show it's now executing again. */
  const handleAccept = useCallback(() => {
    onAccept?.();
  }, [onAccept]);

  const handleFeedback = useCallback(
    (text) => {
      onFeedback?.(text);
    },
    [onFeedback]
  );

  const activeNodeLabel = COMPONENT_LABELS[activeNodeId] ?? activeNodeId;

  /* ── Render ──────────────────────────────────────────────────────── */
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* ── Graph + subgraph area (always full width, never shared with the drawer) ── */}
      <div
        style={{
          width: "100%",
          height: "60vh",
          backgroundColor: "var(--surface-color)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* LOADING */}
        {loading && (
          <div style={overlayStyle}>
            <span style={{ color: "var(--grey-color)" }}>Loading graph...</span>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div style={overlayStyle}>
            <span style={{ color: "var(--danger-color)" }}>
              Failed to load graph: {String(error)}
            </span>
          </div>
        )}

        {/* ---------------- GRAPH MODE ---------------- */}
        {!activeNodeId && (
          <ReactFlow
            nodes={enrichedNodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            fitViewOptions={{ padding: 0.4 }}
            minZoom={0.5}
            maxZoom={4}
          >
            <Background color="var(--border-strong)" gap={20} />

            <Controls
              position="top-right"
              showZoom
              showFitView
              showInteractive
              style={{
                position: "absolute",
                zIndex: 1000,
                background: "var(--surface-elevated)",
                border: "1px solid var(--border-color)",
                borderRadius: "var(--radius-sm)",
                boxShadow: "var(--shadow-md)",
              }}
            />
          </ReactFlow>
        )}

        {/* ---------------- LEVEL 1 -> LEVEL 2 ---------------- */}
        {activeNodeId && level === "1" && (
          <div
            style={{
              padding: "16px",
              height: "100%",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            <Button
              onClick={() => setActiveNodeId(null)}
              size="2"
              variant="soft"
            >
              ← Back to Full Pipeline
            </Button>

            <h4
              style={{
                textAlign: "center",
                color: "var(--primary-color)",
                margin: "12px 0 0",
              }}
            >
              {activeNodeLabel}
            </h4>

            <KnowledgeGraph
              type={activeNodeId}
              reportId={reportId}
              level="2"
              currentDynamicReport={currentDynamicReport}
              setCurrentDynamicReport={setCurrentDynamicReport}
              parentNode={activeNodeId}
              dynamicComponentMap={dynamicComponentMap}
              agentOutput={hitlState?.agentOutputs?.[activeNodeId]}
              liveStatus={nodeStatusMap[activeNodeId]}
            />
          </div>
        )}

        {/* ---------------- LEVEL 2 -> LEVEL 3 ---------------- */}
        {activeNodeId && level === "2" && (
          <div
            style={{
              padding: "16px",
              height: "100%",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            <h4
              style={{
                textAlign: "center",
                color: "var(--primary-color)",
                margin: 0,
              }}
            >
              {activeNodeId
                .split(" ")
                .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
                .join(" ")}
            </h4>

            <KnowledgeGraph
              reportId={reportId}
              level="3"
              name={activeNodeId}
              currentDynamicReport={currentDynamicReport}
              setCurrentDynamicReport={setCurrentDynamicReport}
              parentNode={parentNode}
              dynamicComponentMap={dynamicComponentMap}
              agentOutput={hitlState?.agentOutputs?.[parentNode]}
              liveStatus={parentNode ? nodeStatusMap[parentNode] : undefined}
            />
          </div>
        )}
      </div>

      {/* ── HITL Drawer — dedicated row below the graph, full width ──────── */}
      {/* Driven solely by pipeline status, so it stays visible (or hidden)
          no matter what the user clicks above. Never overlaps or shares
          space with the graph/subgraph area — it's a separate flex row. */}
      {isPaused && hitlState && (
        <div className="hitl-drawer">
          <HITLPanel
            agentName={hitlState.pausedAt}
            agentOutput={hitlState.agentOutputs?.[hitlState.pausedAt] ?? {}}
            onAccept={handleAccept}
            onFeedback={handleFeedback}
            resuming={resuming}
          />
        </div>
      )}
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
