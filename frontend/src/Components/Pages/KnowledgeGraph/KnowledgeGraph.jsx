import { useEffect, useState, useContext } from "react";
import GraphView from "../../Other/KnowGraph/GraphView";
import { AppContext } from "../../../App";
import { Badge, Card } from "@radix-ui/themes";

export default function KnowledgeGraph({
  type = "main",
  reportId,
  level = "1",
  name = "",
  currentDynamicReport,
  setCurrentDynamicReport,
  dynamicComponentMap = {},
  parentNode,
  details = {},
}) {
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [nodeDetails, setNodeDetails] = useState(details);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { BACKEND_URL } = useContext(AppContext);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url =
      level === "1"
        ? `${BACKEND_URL}/api/reports/${reportId}/knowledge-graph`
        : level === "3"
          ? `${BACKEND_URL}/api/reports/${reportId}/knowledge-graph/sub/${parentNode}/${name}`
          : `${BACKEND_URL}/api/reports/${reportId}/knowledge-graph/${type}`;

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
        console.log("API RESPONSE:", data);

        if (level === "3") {
          setNodeDetails(data?.sub_node ?? {});
        } else {
          setGraph(data?.graph ?? { nodes: [], edges: [] });
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || String(err));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [type, reportId, level, parentNode, name, BACKEND_URL]);

  console.log("NODE DETAILS:", nodeDetails);

  return (
    <>
      {level !== "3" && (
        <GraphView
          nodes={graph?.nodes ?? []}
          edges={graph?.edges ?? []}
          loading={loading}
          reportId={reportId}
          parentNode={parentNode}
          details={nodeDetails}
          type={type}
          name={name}
          currentDynamicReport={currentDynamicReport}
          setCurrentDynamicReport={setCurrentDynamicReport}
          dynamicComponentMap={dynamicComponentMap}
          level={level}
          error={error}
        />
      )}
      {level === "3" && (
        <Card
          size="3"
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
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
      )}
    </>
  );
}
