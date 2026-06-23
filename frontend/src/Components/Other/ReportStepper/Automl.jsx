import { useState, useEffect, useContext } from "react";
import { Button, Badge } from "@radix-ui/themes";
import { AppContext } from "../../../App";
import { useParams } from "react-router-dom";

import "../Visualization/Visualization.css";
function DownloadButton({ reportId, size = "normal" }) {
  const [status, setStatus] = useState("idle");

  const handleDownload = async () => {
    setStatus("loading");
    try {
      const response = await fetch(`/download-model/${reportId}`);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `model_${reportId}.pkl`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
      setStatus("idle");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (status === "loading")
    return <span className="download-loading">⏳ Downloading...</span>;

  if (status === "error")
    return <span className="download-loading">✗ Failed</span>;

  return (
    <Button onClick={handleDownload} color="green" variant="surface" siz="1">
      ⬇ {size === "small" ? ".pkl" : "Download Model (.pkl)"}
    </Button>
  );
}

function renderMessage(msg) {
  return msg.split(/(\*\*.*?\*\*|`.*?`|\d+\.\s)/g).map((part, i) => {
    if (!part) return null;

    if (/^\d+\.\s$/.test(part)) {
      return (
        <>
          <br />
          <span key={i} className="light-blue-text">
            {part}
          </span>
        </>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <>
          <span key={i} className="light-blue-text">
            {part.slice(2, -2)}
          </span>
          <br />
        </>
      );
    }

    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="light-blue-text">
          {part.slice(1, -1)}
        </code>
      );
    }

    return <span key={i}>{part}</span>;
  });
}

export default function Automl() {
  const { formatCustomTimestamp } = useContext(AppContext);
  const [dataJson, setDataJson] = useState(null);
  const { BACKEND_URL, downloadReport } = useContext(AppContext);
  const { reportId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/reports/${reportId}?stage=automl_training`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch AutoML data");
        }

        const result = await response.json();
        console.log("result:", result);
        console.log("Automl data fetched:", result.data);
        setDataJson(result.data || {});
      } catch (error) {
        console.error("Error fetching AutoML data:", error);
        setDataJson({});
      }
    };

    if (BACKEND_URL && reportId) {
      fetchData();
    }
  }, [BACKEND_URL, reportId]);
  if (!dataJson) return null;
  const tr = {
    best_score: 0,
    metric_name: "score",
    best_model: "N/A",
    training_method: "N/A",
    models_trained: 0,
    all_models: [],
    confusion_matrix: [
      [0, 0],
      [0, 0],
    ],
    ...(dataJson?.training_results ?? {}),
  };

  const problem_type = dataJson?.problem_type ?? "N/A";
  const workflow = { final_step: "unknown", ...(dataJson?.workflow ?? {}) };
  const target_column = dataJson?.target_column ?? "N/A";
  const model_selection = {
    automl_config: { preset: "N/A" },
    ...(dataJson?.model_selection ?? {}),
  };
  model_selection.automl_config = {
    preset: "N/A",
    ...(model_selection.automl_config ?? {}),
  };

  const agent_messages = dataJson?.agent_messages ?? [];
  const data_path = dataJson?.data_path ?? "N/A";
  const run_timestamp = dataJson?.run_timestamp ?? "";
  const cm = tr.confusion_matrix;
  const score = tr?.best_score ? (tr.best_score * 100).toFixed(2) : "0.00";

  return (
    <div className="stat-container">
      <Button
        size="2"
        variant="soft"
        color="gray"
        onClick={() => downloadReport(reportId)}
      >
        Download Full Report
      </Button>
      <div>
        <h2 className="stat-title">AutoML Report</h2>

        <div className="stat-header-container">
          <Badge color="green" size="3" variant="surface">
            {problem_type}
          </Badge>
          <Badge color="green" size="3" variant="surface">
            {workflow.final_step}
          </Badge>

          <DownloadButton reportId={reportId} />
          <span className="timestamp">
            {formatCustomTimestamp(run_timestamp)}
          </span>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-label">Best Score ({tr.metric_name})</div>
          <div className="score-value">{score}%</div>
        </div>

        <div className="card">
          <div className="card-label">Best Model</div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="card-value">{tr.best_model}</div>
          </div>

          <DownloadButton className="tag" reportId={reportId} size="small" />
          <div style={{ marginTop: "8px" }}>
            <Badge className="ta" variant="surface" size="3">
              {tr.training_method}
            </Badge>
            <Badge className="tag" variant="surface" size="3">
              {model_selection.automl_config.preset}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-label">Target Column</div>
          <div className="card-value">{target_column}</div>
        </div>

        <div className="card">
          <div className="card-label">Models Trained</div>

          <div className="card-value">
            {tr.models_trained}

            {tr.all_models.map((m) => (
              <Badge variant="surface" key={m} className="tag">
                {m}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <h2 className="stat-title">Confusion Matrix</h2>

      <div className="card">
        <div className="matrix">
          <div></div>
          <div className="matrix-cell matrix-header">Pred:0</div>
          <div className="matrix-cell matrix-header">Pred:1</div>

          <div className="matrix-cell matrix-header">Actual:0</div>
          <div className="matrix-cell matrix-tn">{cm[0][0]}</div>
          <div className="matrix-cell matrix-fp">{cm[0][1]}</div>

          <div className="matrix-cell matrix-header">Actual:1</div>
          <div className="matrix-cell matrix-fn">{cm[1][0]}</div>
          <div className="matrix-cell matrix-tp">{cm[1][1]}</div>
        </div>
      </div>

      <h2 className="stat-title">Agent Messages</h2>

      {agent_messages.map((m, i) => (
        <div key={i}>
          <h2 className="stat-title">
            {m.agent.charAt(0).toUpperCase() + m.agent.slice(1)}
          </h2>

          <div className="message-box">
            {m.message.split("\n\n").map((p, i) => (
              <>
                <p key={i}>{renderMessage(p)}</p>
                <br />
              </>
            ))}
          </div>
        </div>
      ))}

      <div className="path-box">
        📁 <span className="path">{data_path}</span>
      </div>
    </div>
  );
}
