import { Handle, Position } from "@xyflow/react";

/**
 * CircleNode
 *
 * Pill-shaped node for the ReactFlow knowledge graph.
 *
 * Supported `data.status` values:
 *   "default"   — teal  (static pipeline nodes)
 *   "active"    — blue + spinner overlay (currently executing, not yet paused)
 *   "complete"  — dark green  (legacy alias)
 *   "completed" — green (HITL: agent finished and accepted)
 *   "paused"    — orange + pulse ring (HITL: waiting for human decision)
 *   "pending"   — gray  (HITL: not yet reached)
 *   "error"     — red
 *
 * Nodes are always clickable regardless of status — the parent decides
 * what clicking does (drill-down is allowed for every status now).
 */
export default function CircleNode({ data, selected }) {
  const status = data?.status || "default";

  /* ── Color map ──────────────────────────────────────────────────── */
  const COLOR_MAP = {
    default: { bg: "var(--primary-color)", border: "var(--light-blue)", text: "var(--light-color)" },
    active: { bg: "#1e3a8a", border: "#60a5fa", text: "#ffffff" },
    complete: { bg: "#14532d", border: "#4ade80", text: "#ffffff" },
    completed: { bg: "#15803d", border: "#4ade80", text: "#ffffff" },
    paused: { bg: "#c2410c", border: "#fb923c", text: "#ffffff" },
    pending: { bg: "#4b5563", border: "#9ca3af", text: "#d1d5db" },
    error: { bg: "#7f1d1d", border: "#f87171", text: "#ffffff" },
  };

  const colors = COLOR_MAP[status] ?? COLOR_MAP.default;

  /* Pulse ring for paused nodes — defined in GraphView.css */
  const className = status === "paused" ? "circle-node--paused" : "";

  return (
    <div
      className={className}
      style={{
        width: "140px",
        height: "44px",
        padding: "0 16px",
        borderRadius: "999px",
        backgroundColor: colors.bg,
        border: `2px solid ${selected ? "var(--warning-color, #facc15)" : colors.border}`,
        color: colors.text,
        fontSize: "13px",
        fontWeight: "600",
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        position: "relative",
        cursor: "pointer",
        transition: "background-color 0.3s, border-color 0.3s",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: colors.border, width: 10, height: 10 }}
      />

      {data?.label}

      {/* Spinner overlay — shown only while this node is actively executing */}
      {status === "active" && (
        <span
          className="circle-node__spinner"
          aria-label="Running"
          title="Running"
        />
      )}

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: colors.border, width: 10, height: 10 }}
      />
    </div>
  );
}
