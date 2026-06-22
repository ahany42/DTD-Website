import { useEffect, useState } from "react";
import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams } from "react-router-dom";
import CircleNode from "../../Other/KnowledgeGraph/CircleNode";

const nodeTypes = {
  circle: CircleNode,
};

const KnowledgeGraphPage = () => {
  const { reportId } = useParams();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        console.log("reportId:", reportId);

        const response = await fetch(
          `http://localhost:4000/api/reports/${reportId}/knowledge-graph`
        );

        const data = await response.json();

        const stages = data.knowledgeGraph || [];

        const graphNodes = stages.map((stage, index) => ({
          id: stage,
          position: {
            x: index * 300,
            y: 200,
          },
          data: {
            label: stage
              .replace("run_", "")
              .replaceAll("_", " ")
              .replace(/\b\w/g, (c) => c.toUpperCase()),
            isSelected: false,
          },
          type: "circle",
        }));

        const graphEdges = stages.slice(1).map((stage, index) => ({
          id: `edge-${index}`,
          source: stages[index],
          target: stage,
        }));

        setNodes(graphNodes);
        setEdges(graphEdges);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGraph();
  }, [reportId]);

  const onNodeClick = (_, node) => {
    setSelectedNode(node);

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: n.id === node.id,
        },
      }))
    );
  };

  const onPaneClick = () => {
    setSelectedNode(null);

    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: {
          ...n.data,
          isSelected: false,
        },
      }))
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
      >
        <Background />
        <Controls />
      </ReactFlow>

      {selectedNode && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "300px",
            padding: "16px",
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
          }}
        >
          <h3>{selectedNode.data.label}</h3>

          <p>
            <strong>Node ID:</strong> {selectedNode.id}
          </p>

          <p>This is the selected pipeline stage.</p>

          <p>
            Later, this panel can display agent outputs, EDA results,
            preprocessing decisions, metrics, warnings, checkpoints, and
            other information received from the GP knowledge graph.
          </p>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraphPage;