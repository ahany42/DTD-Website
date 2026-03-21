import "./Preprocessing.css";

function mapDecisionSource(reason) {
  const value = String(reason || "").toLowerCase();
  if (!value) return "Not specified";
  if (value === "default_policy") return "LLM not used";
  if (value.includes("llm")) return "LLM used";
  return "LLM not used";
}

export default function PreprocessingVisualization({ dataJson }) {
  if (!dataJson || dataJson.length === 0) {
    return (
      <div className="stat-container">
        <div className="message-box">No preprocessing data found.</div>
      </div>
    );
  }

  return (
    <div className="stat-container">
      <div className="automl-header">
        <h2 className="stat-title">Preprocessing Report</h2>
      </div>

      <div className="stat-sub-container">
        {dataJson.map((item, index) => {
          const current = item && typeof item === "object" ? item : {};
          const decisionSource = mapDecisionSource(current.reason);

          return (
          <div key={`${current.column || "column"}-${index}`} className="card">
            <div className="automl-header">
              <div>
                <div className="card-label">Column</div>
                <div className="item-title">{current.column || "-"}</div>
              </div>

              <div
                className={`badge ${
                  current.action?.toLowerCase() === "encode" ||
                  current.action?.toLowerCase() === "transform"
                    ? "badge-blue"
                    : "badge-green"
                }`}
              >
                {current.action || "No Action"}
              </div>
            </div>

            <div className="message-box">
              <strong>Decision Source:</strong> {decisionSource}
            </div>

            <div className="grid-2 preprocessing-grid">
              <div className="card">
                <div className="card-label">Type</div>
                <div className="card-item">{current.details?.type || "-"}</div>
              </div>

              <div className="card">
                <div className="card-label">Missing Values</div>
                <div className="card-item">{current.details?.missing || "-"}</div>
              </div>

              <div className="card">
                <div className="card-label">Outlier Handling</div>
                <div className="card-item">{current.details?.outlier || "-"}</div>
              </div>

              <div className="card">
                <div className="card-label">Encoding</div>
                <div className="card-item">{current.details?.encoding || "-"}</div>
              </div>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}