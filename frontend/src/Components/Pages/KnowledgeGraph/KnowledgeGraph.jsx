import { useEffect, useState } from "react";
import GraphView from "../../Other/KnowGraph/GraphView";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
/**
 * type: one of "main" | "eda" | "preprocessing" | "feature_engineering"
 *       | "model_selection" | "training" | "evaluation"
 * Matches the switch cases in graphBuilder.js on the backend.
 * Defaults to "main" (the full pipeline overview), matching
 * graphBuilder.js's default case.
 */
export default function KnowledgeGraph({ type = "main", reportId }) {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url =
      type && type !== "main"
        ? `${BACKEND_URL}/api/graph/type/${type}`
        : `${BACKEND_URL}/api/graph`;

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
        console.log(`GRAPH DATA [${type}]:`, data);
        setGraph(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || String(err));
      })
      .finally(() => setLoading(false));
  }, [type]);

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
