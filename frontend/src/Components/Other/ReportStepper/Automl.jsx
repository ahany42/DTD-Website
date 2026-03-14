import { useState } from "react";
import { Button, Badge } from "@radix-ui/themes";
import { useContext } from "react";
import { AppContext } from "../../../App";
import "../Visualization/Visualization.css";
const automlData = {
  run_timestamp: "20260228_155942",
  data_path: "Output\\Preprocessing\\full_preprocessed.csv",
  target_column: "Survived",
  problem_type: "classification",
  model_selection: {
    use_automl: true,
    automl_config: {
      models: ["GBM", "XGB"],
      time_limit: 300,
      preset: "best_quality",
    },
    selected_models: [],
    model_selection_reasoning: "...",
  },
  training_results: {
    training_method: "Simple+Optuna",
    best_model: "GBM",
    best_score: 0.9020979020979021,
    metric_name: "accuracy",
    models_trained: 1,
    all_models: ["GBM"],
    all_scores: [0.9020979020979021],
    confusion_matrix: [
      [203, 22],
      [17, 115],
    ],
    best_params_per_model: { GBM: {} },
    optuna_refined_config: {
      models: ["GBM"],
      time_limit: 270,
      preset: "medium_quality",
    },
  },
  agent_messages: [
    {
      agent: "Training",
      message:
        "Training complete. This model demonstrates **excellent** performance with a best score of 0.9021.\n\nBased on the Confusion Matrix, there are **more False Negatives (22)** than False Positives (17).\n\nFor improvement, since AutoGluon only trained one model (GBM), it's recommended to allow it to train and ensemble more diverse models by increasing `time_limit` or `presets`.",
    },
  ],
  workflow: { final_step: "model_trained", error: null },
};

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
  return msg.split(/(\*\*.*?\*\*|`.*?`)/).map((part, i) => {
    if (part.startsWith("**"))
      return (
        <span key={i} className="light-blue-text">
          {part.slice(2, -2)}
        </span>
      );

    if (part.startsWith("`"))
      return (
        <code key={i} className="light-blue-text">
          {part.slice(1, -1)}
        </code>
      );

    return part;
  });
}

export default function Automl() {
  const reportId = 123;
  const d = automlData;
  const tr = d.training_results;
  const cm = tr.confusion_matrix;

  const score = (tr.best_score * 100).toFixed(2);
  const { formatCustomTimestamp } = useContext(AppContext);

  return (
    <div className="stat-container">
      <div>
        <h2 className="stat-title">⚙ AutoML Report</h2>

        <div className="stat-header-container">
          <Badge color="green" size="3" variant="surface">
            {d.problem_type}
          </Badge>
          <Badge color="green" size="3" variant="surface">
            {d.workflow.final_step}
          </Badge>

          <DownloadButton reportId={reportId} />
          <span className="timestamp">
            {formatCustomTimestamp(d.run_timestamp)}
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
              {d.model_selection.automl_config.preset}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-label">Target Column</div>
          <div className="card-value">{d.target_column}</div>
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

      {d.agent_messages.map((m, i) => (
        <div key={i}>
          <h2 className="stat-title">{m.agent}</h2>

          <div className="message-box">
            {m.message.split("\n\n").map((p, i) => (
              <p key={i}>{renderMessage(p)}</p>
            ))}
          </div>
        </div>
      ))}

      <div className="path-box">
        📁 <span className="path">{d.data_path}</span>
      </div>
    </div>
  );
}
