import { Badge } from "@radix-ui/themes";
import "../../Other/Visualization/Visualization.css";

const OP_MAP = {
  multiply:            { label: "×  Multiply",          color: "blue" },
  add:                 { label: "+  Add",                color: "green" },
  subtract:            { label: "−  Subtract",           color: "orange" },
  divide:              { label: "÷  Divide",             color: "purple" },
  mean:                { label: "~  Mean",               color: "teal" },
  absolute_difference: { label: "|Δ|  Abs Difference",  color: "amber" },
};

function CorrelationBar({ value }) {
  const pct = Math.abs(value) * 100;
  const positive = value >= 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
      <div style={{ flex: 1, height: "6px", background: "var(--border-color)", borderRadius: "3px", overflow: "hidden" }}>
        <div
          style={{
            width: `${pct.toFixed(1)}%`,
            height: "100%",
            background: positive ? "var(--primary-color)" : "var(--danger-color)",
            borderRadius: "3px",
            transition: "width 0.3s",
          }}
        />
      </div>
      <span style={{ fontSize: "0.78rem", color: "var(--grey-color)", minWidth: "52px", textAlign: "right" }}>
        {value >= 0 ? "+" : ""}{value.toFixed(3)}
      </span>
    </div>
  );
}

function FeatureCard({ feat, isSelected }) {
  const op = OP_MAP[feat.operation] ?? { label: feat.operation, color: "gray" };

  return (
    <div
      className="card"
      style={{
        padding: "14px 16px",
        borderLeft: `3px solid ${isSelected ? "var(--primary-color)" : "var(--border-color)"}`,
        opacity: isSelected ? 1 : 0.65,
      }}
    >
      {/* Name + badges row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
        <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--heading-color)", fontFamily: "monospace" }}>
          {feat.name}
        </span>
        <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
          {isSelected && <Badge variant="solid" color="green" size="1">Selected</Badge>}
          <Badge variant="soft" color={op.color} size="1">{op.label}</Badge>
        </div>
      </div>

      {/* Columns involved */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
        {feat.columns.map((col, i) => (
          <span key={col} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Badge variant="surface" color="gray" size="1">{col}</Badge>
            {i < feat.columns.length - 1 && (
              <span style={{ fontSize: "0.8rem", color: "var(--grey-color)", fontWeight: 700 }}>
                {op.label.split(" ")[0]}
              </span>
            )}
          </span>
        ))}
      </div>

      {/* Reason */}
      <p style={{ margin: "0 0 8px", fontSize: "0.81rem", color: "var(--grey-color)", lineHeight: 1.6 }}>
        {feat.reason}
      </p>

      {/* Correlation bar */}
      <div>
        <span style={{ fontSize: "0.75rem", color: "var(--grey-color)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          Correlation with target
        </span>
        <CorrelationBar value={feat.correlation_with_target} />
      </div>
    </div>
  );
}

export default function DynamicFeatureEngineering({ data }) {
  if (!data) {
    return (
      <div style={{ padding: "24px", color: "var(--grey-color)", textAlign: "center" }}>
        No feature engineering data available yet.
      </div>
    );
  }

  const generated = data.generated_features ?? [];
  const subNodes = data.sub_nodes ?? [];

  const selected = generated.filter((f) => f.selected);
  const candidates = generated.filter((f) => !f.selected);

  return (
    <div className="stat-container">

      {/* ── Header ── */}
      <h2 className="stat-title">Feature Engineering Report</h2>
      <div className="stat-header-container">
        <Badge color={data.status === "success" ? "green" : "red"} size="2" variant="surface">
          {data.status ?? "unknown"}
        </Badge>
        {data.feedback_applied && (
          <Badge color="orange" size="2" variant="surface">Feedback Applied</Badge>
        )}
      </div>

      {data.message && (
        <p style={{ color: "var(--grey-color)", fontSize: "0.88rem", lineHeight: 1.75, marginBottom: "20px" }}>
          {data.message}
        </p>
      )}

      {/* ── Stats ── */}
      <div className="grid-2" style={{ marginBottom: "20px" }}>
        <div className="card">
          <div className="card-label">Candidates Generated</div>
          <div className="card-value" style={{ fontSize: "1.5rem", fontWeight: 800 }}>{generated.length}</div>
        </div>
        <div className="card">
          <div className="card-label">Features Selected</div>
          <div className="card-value" style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--primary-color)" }}>
            {selected.length}
          </div>
        </div>
      </div>

      {/* ── Selected features ── */}
      {selected.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h3 className="stat-title" style={{ fontSize: "1rem" }}>
            Selected Features
            <span style={{ fontWeight: 400, marginLeft: "6px", color: "var(--grey-color)", textTransform: "none", letterSpacing: 0 }}>
              — added to the dataset
            </span>
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {selected.map((feat) => (
              <FeatureCard key={feat.name} feat={feat} isSelected={true} />
            ))}
          </div>
        </div>
      )}

      {/* ── Rejected candidates ── */}
      {candidates.length > 0 && (
        <div style={{ marginBottom: "24px" }}>
          <h3 className="stat-title" style={{ fontSize: "1rem" }}>
            Rejected Candidates
            <span style={{ fontWeight: 400, marginLeft: "6px", color: "var(--grey-color)", textTransform: "none", letterSpacing: 0 }}>
              — low correlation, not included
            </span>
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {candidates.map((feat) => (
              <FeatureCard key={feat.name} feat={feat} isSelected={false} />
            ))}
          </div>
        </div>
      )}

      {/* ── Pipeline steps ── */}
      {subNodes.length > 0 && (
        <>
          <h2 className="stat-title">Pipeline Steps</h2>
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
        </>
      )}

    </div>
  );
}
