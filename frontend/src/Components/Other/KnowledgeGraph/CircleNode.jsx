import { Handle, Position } from "@xyflow/react";

const CircleNode = ({ data }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />

      <div
        style={{
          width: "180px",
          height: "70px",
          border: "2px solid #2563eb",
          borderRadius: "12px",
          background: "white",
          color: "black",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
        }}
      >
        {data.label}
      </div>

      <Handle type="source" position={Position.Right} />
    </>
  );
};

export default CircleNode;