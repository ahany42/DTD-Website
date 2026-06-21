import { Handle, Position } from "@xyflow/react";

export default function CircleNode({ data, selected }) {
  const status = data?.status || "default"; // "default" | "active" | "complete" | "error"

  const statusColors = {
    default: { bg: "#1f2937", border: "#38bdf8" },
    active: { bg: "#1e3a8a", border: "#60a5fa" },
    complete: { bg: "#14532d", border: "#4ade80" },
    error: { bg: "#7f1d1d", border: "#f87171" },
  };

  const colors = statusColors[status] || statusColors.default;

  return (
    <div
      style={{
        width: "140px",
        height: "44px",
        padding: "0 16px",
        borderRadius: "999px",
        backgroundColor: colors.bg,
        border: `2px solid ${selected ? "#facc15" : colors.border}`,
        color: "white",
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
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: colors.border, width: 10, height: 10 }}
      />

      {data?.label}

      <Handle
        type="source"
        position={Position.Right}
        style={{ background: colors.border, width: 10, height: 10 }}
      />
    </div>
  );
}
