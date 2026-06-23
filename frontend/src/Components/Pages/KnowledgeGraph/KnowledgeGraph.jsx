import { useEffect, useState, useContext } from "react";
import GraphView from "../../Other/KnowGraph/GraphView";
import { AppContext } from "../../../App";

export default function KnowledgeGraph({ type = "main", reportId }) {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { BACKEND_URL } = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    setError(null);

    const url =
      type && type === "main"
        ? `${BACKEND_URL}/api/reports/${reportId}/knowledge-graph`
        : `${BACKEND_URL}/api/reports/type/${type}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          // Catches the misrouted-request failure mode (HTML returned
          // instead of JSON) explicitly instead of a vague parse error.
          throw new Error(
            "Response was not JSON — check BACKEND_URL and that /api/graph isn't being intercepted by the frontend router."
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log(`GRAPH DATA [${type}]:`, data.graph.nodes);
        setGraph(data.graph);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || String(err));
      })
      .finally(() => setLoading(false));
  }, [type, reportId, BACKEND_URL]);

  return (
    <>
      <GraphView
        nodes={graph.nodes}
        edges={graph.edges}
        loading={loading}
        error={error}
      />
    </>
  );
}
