import { ReactFlow, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams, useNavigate } from "react-router-dom";
import CircleNode from "../../Other/KnowledgeGraph/CircleNode";

const nodeTypes = {
  circle: CircleNode,
};

const AgentGraphPage = () => {
  const { reportId, agentName } = useParams();
  const navigate = useNavigate();

  const nodes = [
    {
      id: "root",
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
      id: "1",
      position: { x: 50, y: 250 },
      data: { label: "Decision 1" },
      type: "circle",
    },

    {
      id: "2",
      position: { x: 300, y: 250 },
      data: { label: "Decision 2" },
      type: "circle",
    },

    {
      id: "3",
      position: { x: 550, y: 250 },
      data: { label: "Decision 3" },
      type: "circle",
    },
  ];

  const edges = [
    {
      id: "e1",
      source: "root",
      target: "1",
    },
    {
      id: "e2",
      source: "root",
      target: "2",
    },
    {
      id: "e3",
      source: "root",
      target: "3",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        position: "relative",
      }}
    >
      <button
        onClick={() =>
          navigate(`/reports/${reportId}/knowledge-graph`)
        }
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,

          padding: "10px 16px",

          border: "1px solid #d1d5db",
          borderRadius: "8px",

          background: "white",

          fontWeight: 600,
          cursor: "pointer",

          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        ← Back
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 1,
        }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default AgentGraphPage;

// import { useEffect, useState } from "react";
// import { ReactFlow, Background, Controls } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import { useParams, useNavigate } from "react-router-dom";
// import CircleNode from "../../Other/KnowledgeGraph/CircleNode";

// const nodeTypes = {
//   circle: CircleNode,
// };

// const AgentGraphPage = () => {
//   const { reportId, agentName } = useParams();
//   const navigate = useNavigate();

//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);

//   useEffect(() => {
//     const fetchGraph = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:4000/api/reports/${reportId}/knowledge-graph/${agentName}`
//         );

//         const data = await response.json();

//         const items = data.agentGraph || [];

//         const rootNode = {
//           id: "root",
//           position: {
//             x: 300,
//             y: 50,
//           },
//           data: {
//             label: agentName
//               .replace("run_", "")
//               .replaceAll("_", " ")
//               .replace(/\b\w/g, (c) => c.toUpperCase()),
//           },
//           type: "circle",
//         };

//         const childNodes = items.map((item, index) => ({
//           id: item,
//           position: {
//             x: index * 250,
//             y: 250,
//           },
//           data: {
//             label: item
//               .replaceAll("_", " ")
//               .replace(/\b\w/g, (c) => c.toUpperCase()),
//           },
//           type: "circle",
//         }));

//         const graphEdges = items.map((item, index) => ({
//           id: `edge-${index}`,
//           source: "root",
//           target: item,
//         }));

//         setNodes([rootNode, ...childNodes]);
//         setEdges(graphEdges);
//       } catch (error) {
//         console.error("Failed to load agent graph:", error);
//       }
//     };

//     fetchGraph();
//   }, [reportId, agentName]);

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100vh",
//         position: "relative",
//       }}
//     >
//       <button
//         onClick={() =>
//           navigate(`/reports/${reportId}/knowledge-graph`)
//         }
//         style={{
//           position: "absolute",
//           top: "20px",
//           right: "20px",
//           zIndex: 1000,

//           padding: "10px 16px",

//           border: "1px solid #d1d5db",
//           borderRadius: "8px",

//           background: "white",

//           fontWeight: 600,
//           cursor: "pointer",

//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//         }}
//       >
//         ← Back
//       </button>

//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         nodeTypes={nodeTypes}
//         fitView
//         fitViewOptions={{
//           padding: 1,
//         }}
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// };

// export default AgentGraphPage;

// import { useEffect, useState } from "react";
// import { ReactFlow, Background, Controls } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import { useParams, useNavigate } from "react-router-dom";
// import CircleNode from "../../Other/KnowledgeGraph/CircleNode";

// const nodeTypes = {
//   circle: CircleNode,
// };

// const AgentGraphPage = () => {
//   const { reportId, agentName } = useParams();
//   const navigate = useNavigate();

//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);
//   const [selectedNode, setSelectedNode] = useState(null);

//   useEffect(() => {
//     const fetchGraph = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:4000/api/reports/${reportId}/knowledge-graph/${agentName}`
//         );

//         const data = await response.json();

//         const items = data.agentGraph || [];

//         const rootNode = {
//           id: "root",
//           position: {
//             x: 300,
//             y: 50,
//           },
//           data: {
//             label: agentName
//               .replace("run_", "")
//               .replaceAll("_", " ")
//               .replace(/\b\w/g, (c) => c.toUpperCase()),
//           },
//           type: "circle",
//         };

//         const childNodes = items.map((item, index) => ({
//           id: item,
//           position: {
//             x: index * 250,
//             y: 250,
//           },
//           data: {
//             label: item
//               .replaceAll("_", " ")
//               .replace(/\b\w/g, (c) => c.toUpperCase()),
//           },
//           type: "circle",
//         }));

//         const graphEdges = items.map((item, index) => ({
//           id: `edge-${index}`,
//           source: "root",
//           target: item,
//         }));

//         setNodes([rootNode, ...childNodes]);
//         setEdges(graphEdges);
//       } catch (error) {
//         console.error("Failed to load agent graph:", error);
//       }
//     };

//     fetchGraph();
//   }, [reportId, agentName]);

//   const onNodeClick = (_, node) => {
//     setSelectedNode(node);
//   };

//   const onPaneClick = () => {
//     setSelectedNode(null);
//   };

//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "100vh",
//         position: "relative",
//       }}
//     >
//       <button
//         onClick={() =>
//           navigate(`/reports/${reportId}/knowledge-graph`)
//         }
//         style={{
//           position: "absolute",
//           top: "20px",
//           right: "20px",
//           zIndex: 1000,

//           padding: "10px 16px",

//           border: "1px solid #d1d5db",
//           borderRadius: "8px",

//           background: "white",

//           fontWeight: 600,
//           cursor: "pointer",

//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//         }}
//       >
//         ← Back
//       </button>

//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         nodeTypes={nodeTypes}
//         fitView
//         fitViewOptions={{
//           padding: 1,
//         }}
//         onNodeClick={onNodeClick}
//         onPaneClick={onPaneClick}
//       >
//         <Background />
//         <Controls />
//       </ReactFlow>

//       {selectedNode?.id === "root" && (
//         <div
//           style={{
//             position: "absolute",
//             top: "90px",
//             right: "20px",

//             width: "320px",

//             background: "white",
//             border: "1px solid #ddd",
//             borderRadius: "12px",

//             padding: "16px",

//             boxShadow: "0 4px 12px rgba(0,0,0,0.1)",

//             zIndex: 1000,
//           }}
//         >
//           <h3>{selectedNode.data.label}</h3>

//           <p>
//             This graph shows the major decisions produced by the{" "}
//             {selectedNode.data.label} agent.
//           </p>

//           <p>
//             Click the button below to view the complete report
//             section associated with this agent.
//           </p>

//           <button
//             onClick={() =>
//               navigate(`/reports/${reportId}`)
//             }
//             style={{
//               width: "100%",

//               padding: "10px",

//               border: "none",
//               borderRadius: "8px",

//               background: "#2563eb",
//               color: "white",

//               fontWeight: 600,
//               cursor: "pointer",
//             }}
//           >
//             View Full Report
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AgentGraphPage;