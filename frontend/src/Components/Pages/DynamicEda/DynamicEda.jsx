import { useContext } from "react";
import { AppContext } from "../../../App";
import "./DynamicEda.css";

function toImageUrl(backendUrl, vizPath) {
  // vizPath looks like "../../../Output/eda/<id>/filename.png"
  // extract everything from "Output/" onwards
  const match = vizPath?.match(/Output\/.+/);
  if (!match) return null;
  return `${backendUrl}/${match[0]}`;
}

export default function DynamicEDAReport({ data }) {
  const { BACKEND_URL } = useContext(AppContext);

  if (!data) {
    return (
      <div style={{ padding: "24px", color: "#94a3b8", textAlign: "center" }}>
        No EDA data available yet.
      </div>
    );
  }

  return (
    <div className="eda-page">
      <div className="eda-container">

        {/* HEADER */}
        <div className="eda-card">
          <h1 className="eda-title">{data.title}</h1>
          <p className="eda-summary">{data.summary}</p>
        </div>

        {/* SECTIONS */}
        {data.sections?.map((section, si) => (
          <div key={si} className="eda-card">
            <h2 className="section-title">{section.title}</h2>
            <div className="section-content">
              {section.content?.map((item, ii) => {
                if (item.type === "text") {
                  return (
                    <p key={ii} className="text-item">
                      {item.label && <strong>{item.label}: </strong>}
                      {item.value}
                    </p>
                  );
                }
                if (item.type === "bullet") {
                  return (
                    <div key={ii} className="bullet-item">
                      {item.label && <h4 className="bullet-label">{item.label}</h4>}
                      <p>• {item.value}</p>
                    </div>
                  );
                }
                if (item.type === "warning") {
                  return (
                    <div key={ii} className="warning-card">
                      {item.label && <strong>{item.label}: </strong>}
                      {item.value}
                    </div>
                  );
                }
                if (item.type === "metric") {
                  return (
                    <div key={ii} className="metric-item">
                      <div className="metric-label">{item.label}</div>
                      <div className="metric-value">{item.value}</div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}

        {/* PLOTS */}
        {data.visualization_paths?.length > 0 && (
          <div className="plots-grid">
            {data.visualization_paths.map((vizPath, i) => {
              const src = toImageUrl(BACKEND_URL, vizPath);
              const filename = vizPath.split("/").pop().replace(".png", "").replace(/_/g, " ");
              return (
                <div key={i} className="eda-card">
                  <h2 className="plot-title" style={{ textTransform: "capitalize" }}>{filename}</h2>
                  {src ? (
                    <img src={src} alt={filename} className="plot-image" />
                  ) : (
                    <p style={{ color: "#94a3b8", fontSize: "13px" }}>Image path unavailable</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* RECOMMENDATIONS */}
        {data.recommendations?.length > 0 && (
          <div className="eda-card">
            <h2 className="section-title">Recommendations</h2>
            <div className="recommendations-list">
              {data.recommendations.map((rec, i) => {
                const parts = rec.split(/(\*\*.*?\*\*)/g).map((part, j) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={j}>{part.slice(2, -2)}</strong>;
                  }
                  return <span key={j}>{part}</span>;
                });
                return <div key={i} className="recommendation-item">{parts}</div>;
              })}
            </div>
          </div>
        )}

        {/* WARNINGS */}
        {data.warnings?.length > 0 && (
          <div className="eda-card">
            <h2 className="section-title">Warnings</h2>
            <div className="section-content">
              {data.warnings.map((w, i) => (
                <div key={i} className="warning-card">
                  <strong>{w.columns?.join(", ")}: </strong>{w.message}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
