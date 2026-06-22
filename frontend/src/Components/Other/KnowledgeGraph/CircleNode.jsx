import { Handle, Position } from "@xyflow/react";

const CircleNode = ({ data }) => {
  const selected = data.isSelected;

  return (
    <>
      <Handle type="target" position={Position.Left} />

      <div
        style={{
          width: "180px",
          height: "70px",
          border: "2px solid #2563eb",
          borderRadius: "12px",

          background: selected ? "#1e40af" : "white",

          color: selected ? "white" : "black",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          fontWeight: 600,

          transition: "all 0.2s ease",

          boxShadow: selected
            ? "0 0 12px rgba(37,99,235,0.4)"
            : "none",

          cursor: "pointer",
        }}
      >
        {data.label}
      </div>

      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default CircleNode;