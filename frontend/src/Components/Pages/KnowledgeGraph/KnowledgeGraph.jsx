/**
 * KnowledgeGraph.jsx
 *
 * Fetches knowledge-graph data for a report and renders it via GraphView.
 *
 * Levels:
 *   "1" — top-level pipeline nodes (eda / preprocessing / ...)
 *   "2" — sub-nodes for one agent (e.g. sub-steps of EDA)
 *   "3" — full detail card for a single sub-node
 *
 * HITL props (only used at level "1", passed from ViewReport in custom mode):
 *   hitlState, onAccept, onFeedback, resuming
 *
 * Re-fetches automatically when `reportRefreshFlag` changes (triggered by
 * ViewReport each time an SSE event arrives from the pipeline).
 */

import { useEffect, useState, useContext } from "react";
import GraphView from "../../Other/KnowGraph/GraphView";
import { AppContext, ReportContext } from "../../../App";
import { Badge, Card } from "@radix-ui/themes";

export default function KnowledgeGraph({
  /* Navigation / drill-down props (existing) */
  type = "main",
  reportId,
  level = "1",
  name = "",
  parentNode,
  details = {},
  /* Legacy props kept for backward-compat */
  currentDynamicReport = null,
  setCurrentDynamicReport = () => {},
  dynamicComponentMap = {},
  /* HITL props (new — only used at level "1") */
  hitlState = null,
  onAccept = null,
  onFeedback = null,
  resuming = false,
}) {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [nodeDetails, setNodeDetails] = useState(details);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { BACKEND_URL } = useContext(AppContext);
  /* reportRefreshFlag triggers re-fetch whenever the pipeline progresses */
  const { reportRefreshFlag } = useContext(ReportContext);

  /* ── Fetch graph / sub-node data ────────────────────────────────── */
  useEffect(() => {
    let cancelled = false;

    const url =
      level === "1"
        ? `${BACKEND_URL}/api/reports/${reportId}/knowledge-graph`
        : level === "3"
          ? `${BACKEND_URL}/api/reports/${reportId}/knowledge-graph/sub/${parentNode}/${name}`
          : `${BACKEND_URL}/api/reports/${reportId}/knowledge-graph/${type}`;

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          throw new Error(
            "Response was not JSON — check BACKEND_URL and routing."
          );
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (level === "3") {
          setNodeDetails(data?.sub_node ?? {});
        } else {
          setGraph(data?.graph ?? { nodes: [], edges: [] });
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
    // reportRefreshFlag included so graph re-fetches after every pipeline event
  }, [type, reportId, level, parentNode, name, BACKEND_URL, reportRefreshFlag]);

  /* ── Level 3: raw key-value detail card ─────────────────────────── */
  if (level === "3") {
    return (
      <Card size="3" style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {Object.entries(nodeDetails ?? {}).map(([key, value]) => (
          <div
            key={key}
            style={{
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <h4
              style={{
                margin: "0 0 8px",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {key.replace(/_/g, " ")}
            </h4>

            {key === "status" ? (
              <Badge
                color={
                  value === "completed"
                    ? "green"
                    : value === "running"
                      ? "blue"
                      : "gray"
                }
              >
                {String(value)}
              </Badge>
            ) : (
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {typeof value === "object"
                  ? JSON.stringify(value, null, 2)
                  : String(value)}
              </pre>
            )}
          </div>
        ))}
      </Card>
    );
  }

  /* ── Level 1 & 2: render graph ──────────────────────────────────── */
  return (
    <GraphView
      nodes={graph?.nodes ?? []}
      edges={graph?.edges ?? []}
      loading={loading}
      reportId={reportId}
      parentNode={parentNode}
      details={nodeDetails}
      type={type}
      name={name}
      level={level}
      error={error}
      /* Legacy props */
      currentDynamicReport={currentDynamicReport}
      setCurrentDynamicReport={setCurrentDynamicReport}
      dynamicComponentMap={dynamicComponentMap}
      /* HITL props — only forwarded at level 1 */
      hitlState={level === "1" ? hitlState : null}
      onAccept={level === "1" ? onAccept : null}
      onFeedback={level === "1" ? onFeedback : null}
      resuming={level === "1" ? resuming : false}
    />
  );
}
