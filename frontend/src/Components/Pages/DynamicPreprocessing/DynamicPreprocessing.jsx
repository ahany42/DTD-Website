import { Badge } from "@radix-ui/themes";
import "../../Other/Visualization/Visualization.css";

const MISSING_MAP = {
  median: { label: "Median Impute", color: "indigo" },
  mean: { label: "Mean Impute", color: "indigo" },
  mode: { label: "Mode Impute", color: "indigo" },
};

const OUTLIER_MAP = {
  clip_iqr: { label: "Clip IQR", color: "orange" },
  log_transform: { label: "Log Transform", color: "orange" },
  cap: { label: "Cap", color: "orange" },
};

const ENCODING_MAP = {
  onehot: { label: "One-Hot", color: "teal" },
  ordinal: { label: "Ordinal", color: "teal" },
  label: { label: "Label Encode", color: "teal" },
};

function OpBadge({ map, value }) {
  const entry = map[value];
  if (!entry) return null;
  return (
    <Badge variant="soft" color={entry.color} size="1" style={{ marginRight: "5px", marginBottom: "4px" }}>
      {entry.label}
    </Badge>
  );
}

function ColumnCard({ col }) {
  const { column, action, reason, details = {} } = col;
  const isDrop = action === "drop";

  const hasMissing = MISSING_MAP[details.missing];
  const hasOutlier = OUTLIER_MAP[details.outlier];
  const hasEncoding = ENCODING_MAP[details.encoding];
  const hasOps = hasMissing || hasOutlier || hasEncoding;

  return (
    <div
      className="card"
      style={{
        padding: "14px 16px",
        borderLeft: `3px solid ${isDrop ? "#ef4444" : hasOps ? "var(--primary-color)" : "var(--border-color)"}`,
      }}
    >
      {/* Column name + type */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--heading-color)" }}>
          {column}
        </span>
        <div style={{ display: "flex", gap: "5px" }}>
          {isDrop && (
            <Badge variant="surface" color="red" size="1">Dropped</Badge>
          )}
          {details.type && (
            <Badge variant="soft" color="gray" size="1">{details.type}</Badge>
          )}
        </div>
      </div>

      {/* Operation badges */}
      {hasOps && (
        <div style={{ marginBottom: "8px" }}>
          <OpBadge map={MISSING_MAP} value={details.missing} />
          <OpBadge map={OUTLIER_MAP} value={details.outlier} />
          <OpBadge map={ENCODING_MAP} value={details.encoding} />
        </div>
      )}

      {/* Reason */}
      <p style={{ margin: 0, fontSize: "0.81rem", color: "var(--grey-color)", lineHeight: 1.6 }}>
        {reason}
      </p>
    </div>
  );
}

export default function DynamicPreprocessing({ data }) {
  if (!data) {
    return (
      <div style={{ padding: "24px", color: "#94a3b8", textAlign: "center" }}>
        No preprocessing data available yet.
      </div>
    );
  }

  const plan = data.preprocessing_plan ?? {};
  const columnActions = data.column_actions ?? [];
  const subNodes = data.sub_nodes ?? [];

  const scaling = plan.scaling?.method;
  const balancing = plan.balancing?.method;
  const feEng = plan.feature_engineering?.enabled;

  const numeric = columnActions.filter((c) => c.details?.type === "numeric");
  const categorical = columnActions.filter((c) => c.details?.type === "categorical");
  const withMissing = columnActions.filter((c) => MISSING_MAP[c.details?.missing]);
  const withEncoding = columnActions.filter((c) => ENCODING_MAP[c.details?.encoding]);

  return (
    <div className="stat-container">

      {/* ── Header ── */}
      <h2 className="stat-title">Preprocessing Report</h2>
      <div className="stat-header-container">
        <Badge color={data.status === "success" ? "green" : "red"} size="2" variant="surface">
          {data.status ?? "unknown"}
        </Badge>
        {data.task_type && (
          <Badge color="blue" size="2" variant="surface">{data.task_type}</Badge>
        )}
        {scaling && scaling !== "none" && (
          <Badge color="teal" size="2" variant="surface">Scaling: {scaling}</Badge>
        )}
        {balancing && balancing !== "none" && (
          <Badge color="orange" size="2" variant="surface">Balancing: {balancing}</Badge>
        )}
        {feEng && (
          <Badge color="purple" size="2" variant="surface">Feature Engineering</Badge>
        )}
      </div>

      {/* ── Plan summary ── */}
      {plan.summary && (
        <p style={{ color: "var(--grey-color)", fontSize: "0.88rem", lineHeight: 1.75, marginBottom: "20px" }}>
          {plan.summary}
        </p>
      )}

      {/* ── Stats grid ── */}
      <div className="grid-2" style={{ marginBottom: "20px" }}>
        <div className="card">
          <div className="card-label">Numeric / Categorical</div>
          <div className="card-value" style={{ fontSize: "1.3rem", fontWeight: 800 }}>
            {numeric.length} <span style={{ color: "var(--grey-color)", fontWeight: 400 }}>/</span> {categorical.length}
          </div>
        </div>
        <div className="card">
          <div className="card-label">Imputed / Encoded</div>
          <div className="card-value" style={{ fontSize: "1.3rem", fontWeight: 800 }}>
            {withMissing.length} <span style={{ color: "var(--grey-color)", fontWeight: 400 }}>/</span> {withEncoding.length}
          </div>
        </div>
      </div>

      {/* ── Column cards ── */}
      {columnActions.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h3 className="stat-title" style={{ fontSize: "1rem" }}>Column Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {columnActions.map((col, i) => (
              <ColumnCard key={i} col={col} />
            ))}
          </div>
        </div>
      )}

      {/* ── Pipeline steps ── */}
      {subNodes.length > 0 && (
        <div>
          <h3 className="stat-title" style={{ fontSize: "1rem" }}>Pipeline Steps</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {subNodes.map((node, i) => (
              <div
                key={i}
                className="card"
                style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "var(--heading-color)", marginBottom: "4px" }}>
                    {node.name}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--grey-color)", lineHeight: 1.5 }}>
                    {node.description}
                  </div>
                </div>
                <Badge
                  variant="soft"
                  color={node.status === "completed" ? "green" : node.status === "failed" ? "red" : "gray"}
                  size="1"
                  style={{ flexShrink: 0 }}
                >
                  {node.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
