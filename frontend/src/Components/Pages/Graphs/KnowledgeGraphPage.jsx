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
          },
          type: "circle",
        }));

        const graphEdges = stages.slice(1).map((stage, index) => ({
          id: `edge-${index}`,
          source: stages[index],
          target: stage,
        }));
        console.log("Nodes:", graphNodes);
        console.log(graphNodes[0]);
        console.log(graphNodes[0].data);
        console.log(graphNodes[0].data.label);
        setNodes(graphNodes);
        setEdges(graphEdges);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGraph();
  }, [reportId]);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default KnowledgeGraphPage;