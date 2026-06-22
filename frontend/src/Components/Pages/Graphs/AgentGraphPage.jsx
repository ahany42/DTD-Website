import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams } from "react-router-dom";
import CircleNode from "../../Other/KnowledgeGraph/CircleNode";

const nodeTypes = {
  circle: CircleNode,
};

const AgentGraphPage = () => {
  const { agentName } = useParams();

  const nodes = [
    {
      id: "1",
      position: { x: 300, y: 50 },
      data: {
        label: agentName
          .replace("run_", "")
          .replaceAll("_", " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      },
      type: "circle",
    },

    {
      id: "2",
      position: { x: 100, y: 250 },
      data: { label: "Decision 1" },
      type: "circle",
    },

    {
      id: "3",
      position: { x: 300, y: 250 },
      data: { label: "Decision 2" },
      type: "circle",
    },

    {
      id: "4",
      position: { x: 500, y: 250 },
      data: { label: "Decision 3" },
      type: "circle",
    },
  ];

  const edges = [
    {
      id: "e1",
      source: "1",
      target: "2",
    },
    {
      id: "e2",
      source: "1",
      target: "3",
    },
    {
      id: "e3",
      source: "1",
      target: "4",
    },
  ];

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default AgentGraphPage;