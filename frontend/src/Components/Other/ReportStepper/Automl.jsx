import { useState } from "react";

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
      agent: "training",
      message:
        "Training complete. This model demonstrates **excellent** performance with a best score of 0.9021.\n\nBased on the Confusion Matrix, there are **more False Negatives (22)** than False Positives (17).\n\nFor improvement, since AutoGluon only trained one model (GBM), it's recommended to allow it to train and ensemble more diverse models by increasing `time_limit` or `presets`.",
    },
  ],
  workflow: { final_step: "model_trained", error: null },
};

const styles = {
  container: {
    fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
    background: "#0d1117",
    color: "#e6edf3",
    borderRadius: "12px",
    padding: "28px",
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #21262d",
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#58a6ff",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    margin: 0,
  },
  badge: (color) => ({
    background:
      color === "green" ? "#1a4731" : color === "blue" ? "#1c3461" : "#2d2d00",
    color:
      color === "green" ? "#3fb950" : color === "blue" ? "#58a6ff" : "#d29922",
    border: `1px solid ${color === "green" ? "#2ea043" : color === "blue" ? "#388bfd" : "#9e6a03"}`,
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "0.72rem",
    fontWeight: "600",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  }),
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },
  card: {
    background: "#161b22",
    border: "1px solid #21262d",
    borderRadius: "8px",
    padding: "16px 20px",
  },
  cardLabel: {
    fontSize: "0.7rem",
    color: "#8b949e",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "6px",
  },
  cardValue: {
    fontSize: "1rem",
    color: "#e6edf3",
    fontWeight: "500",
  },
  scoreValue: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "#3fb950",
    letterSpacing: "-0.02em",
  },
  sectionTitle: {
    fontSize: "0.75rem",
    color: "#8b949e",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "12px",
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  divider: {
    flex: 1,
    height: "1px",
    background: "#21262d",
  },
  matrixGrid: {
    display: "grid",
    gridTemplateColumns: "auto 1fr 1fr",
    gap: "4px",
    fontSize: "0.8rem",
    maxWidth: "280px",
  },
  matrixCell: (type) => ({
    padding: "10px 14px",
    borderRadius: "6px",
    textAlign: "center",
    fontWeight: "600",
    background:
      type === "tp"
        ? "#1a4731"
        : type === "tn"
          ? "#1a4731"
          : type === "fp"
            ? "#3d1a1a"
            : type === "fn"
              ? "#3d1a1a"
              : "transparent",
    color:
      type === "tp" || type === "tn"
        ? "#3fb950"
        : type === "fp" || type === "fn"
          ? "#f85149"
          : "#8b949e",
    border: `1px solid ${
      type === "tp" || type === "tn"
        ? "#2ea043"
        : type === "fp" || type === "fn"
          ? "#da3633"
          : "transparent"
    }`,
  }),
  messageBox: {
    background: "#161b22",
    border: "1px solid #21262d",
    borderLeft: "3px solid #58a6ff",
    borderRadius: "0 8px 8px 0",
    padding: "14px 18px",
    fontSize: "0.85rem",
    lineHeight: "1.7",
    color: "#c9d1d9",
  },
  configRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #21262d",
    fontSize: "0.83rem",
  },
  configKey: { color: "#8b949e" },
  configVal: { color: "#e6edf3", fontWeight: "500" },
  tag: {
    display: "inline-block",
    background: "#1c3461",
    color: "#79c0ff",
    border: "1px solid #388bfd",
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "0.72rem",
    marginRight: "6px",
    fontWeight: "600",
  },
  downloadBtn: (size = "normal") => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#1a4731",
    color: "#3fb950",
    border: "1px solid #2ea043",
    borderRadius: "6px",
    padding: size === "small" ? "4px 10px" : "6px 14px",
    fontSize: size === "small" ? "0.72rem" : "0.78rem",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    letterSpacing: "0.03em",
    transition: "all 0.15s",
    textDecoration: "none",
    whiteSpace: "nowrap",
  }),
  downloadBtnLoading: (size = "normal") => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "#161b22",
    color: "#8b949e",
    border: "1px solid #21262d",
    borderRadius: "6px",
    padding: size === "small" ? "4px 10px" : "6px 14px",
    fontSize: size === "small" ? "0.72rem" : "0.78rem",
    fontWeight: "600",
    cursor: "not-allowed",
    fontFamily: "inherit",
    letterSpacing: "0.03em",
    whiteSpace: "nowrap",
  }),
};

function DownloadButton({ reportId, modelName, size = "normal" }) {
  const [status, setStatus] = useState("idle"); // idle | loading | error

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
    } catch (err) {
      console.error("Download failed:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (status === "loading") {
    return (
      <span style={styles.downloadBtnLoading(size)}>⏳ Downloading...</span>
    );
  }

  if (status === "error") {
    return (
      <span
        style={{
          ...styles.downloadBtnLoading(size),
          color: "#f85149",
          borderColor: "#da3633",
        }}
      >
        ✗ Failed — retry?
      </span>
    );
  }

  return (
    <button onClick={handleDownload} style={styles.downloadBtn(size)}>
      ⬇ {size === "small" ? ".pkl" : "Download Model (.pkl)"}
    </button>
  );
}

function renderMessage(msg) {
  return msg.split(/(\*\*.*?\*\*|`.*?`)/).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong key={i} style={{ color: "#e6edf3" }}>
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code
          key={i}
          style={{
            background: "#21262d",
            padding: "1px 5px",
            borderRadius: "3px",
            color: "#79c0ff",
          }}
        >
          {part.slice(1, -1)}
        </code>
      );
    return part;
  });
}

export default function Automl() {
  const reportId=123 // This would be passed as a prop in a real scenario, hardcoded here for demo
  const d = automlData;
  const tr = d.training_results;
  const cm = tr.confusion_matrix;
  const score = (tr.best_score * 100).toFixed(2);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>⚙ AutoML Report</h2>
        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={styles.badge("blue")}>{d.problem_type}</span>
          <span style={styles.badge("green")}>{d.workflow.final_step}</span>
          <span style={{ fontSize: "0.72rem", color: "#8b949e" }}>
            {d.run_timestamp.replace(
              /(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/,
              "$1-$2-$3 $4:$5:$6"
            )}
          </span>
          <DownloadButton
            reportId={reportId}
            modelName={tr.best_model}
            size="normal"
          />
        </div>
      </div>

      {/* Key Metrics */}
      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Best Score ({tr.metric_name})</div>
          <div style={styles.scoreValue}>{score}%</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Best Model</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <div style={styles.cardValue}>{tr.best_model}</div>
            <DownloadButton
              reportId={reportId}
              modelName={tr.best_model}
              size="small"
            />
          </div>
          <div style={{ marginTop: "8px" }}>
            <span style={styles.tag}>{tr.training_method}</span>
            <span style={styles.tag}>
              {d.model_selection.automl_config.preset}
            </span>
          </div>
        </div>
      </div>

      <div style={styles.grid2}>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Target Column</div>
          <div style={styles.cardValue}>{d.target_column}</div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardLabel}>Models Trained</div>
          <div style={styles.cardValue}>
            {tr.models_trained} &nbsp;
            {tr.all_models.map((m) => (
              <span key={m} style={styles.tag}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Confusion Matrix */}
      <div style={styles.sectionTitle}>
        Confusion Matrix <div style={styles.divider} />
      </div>
      <div style={{ ...styles.card, display: "inline-block" }}>
        <div style={styles.matrixGrid}>
          <div
            style={{ ...styles.matrixCell("header"), padding: "6px 10px" }}
          />
          <div
            style={{
              ...styles.matrixCell("header"),
              padding: "6px 10px",
              textAlign: "center",
            }}
          >
            Pred: 0
          </div>
          <div
            style={{
              ...styles.matrixCell("header"),
              padding: "6px 10px",
              textAlign: "center",
            }}
          >
            Pred: 1
          </div>
          <div style={{ ...styles.matrixCell("header"), padding: "8px 10px" }}>
            Actual: 0
          </div>
          <div style={styles.matrixCell("tn")}>
            {cm[0][0]}
            <div style={{ fontSize: "0.65rem", fontWeight: 400, opacity: 0.7 }}>
              TN
            </div>
          </div>
          <div style={styles.matrixCell("fp")}>
            {cm[0][1]}
            <div style={{ fontSize: "0.65rem", fontWeight: 400, opacity: 0.7 }}>
              FP
            </div>
          </div>
          <div style={{ ...styles.matrixCell("header"), padding: "8px 10px" }}>
            Actual: 1
          </div>
          <div style={styles.matrixCell("fn")}>
            {cm[1][0]}
            <div style={{ fontSize: "0.65rem", fontWeight: 400, opacity: 0.7 }}>
              FN
            </div>
          </div>
          <div style={styles.matrixCell("tp")}>
            {cm[1][1]}
            <div style={{ fontSize: "0.65rem", fontWeight: 400, opacity: 0.7 }}>
              TP
            </div>
          </div>
        </div>
      </div>

      {/* AutoML Config */}
      <div style={styles.sectionTitle}>
        AutoML Configuration <div style={styles.divider} />
      </div>
      <div style={styles.card}>
        {[
          [
            "Models Configured",
            d.model_selection.automl_config.models.join(", "),
          ],
          ["Time Limit", `${d.model_selection.automl_config.time_limit}s`],
          ["Preset", d.model_selection.automl_config.preset],
          ["Optuna Time Limit", `${tr.optuna_refined_config.time_limit}s`],
          ["Optuna Preset", tr.optuna_refined_config.preset],
        ].map(([k, v]) => (
          <div key={k} style={styles.configRow}>
            <span style={styles.configKey}>{k}</span>
            <span style={styles.configVal}>{v}</span>
          </div>
        ))}
      </div>

      {/* Agent Message */}
      <div style={styles.sectionTitle}>
        Agent Messages <div style={styles.divider} />
      </div>
      {d.agent_messages.map((m, i) => (
        <div key={i} style={{ marginBottom: "10px" }}>
          <div
            style={{
              fontSize: "0.72rem",
              color: "#58a6ff",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            [{m.agent}]
          </div>
          <div style={styles.messageBox}>
            {m.message.split("\n\n").map((para, pi) => (
              <p key={pi} style={{ margin: "0 0 8px 0" }}>
                {renderMessage(para)}
              </p>
            ))}
          </div>
        </div>
      ))}

      {/* Data Path */}
      <div
        style={{
          marginTop: "20px",
          padding: "10px 14px",
          background: "#161b22",
          border: "1px solid #21262d",
          borderRadius: "6px",
          fontSize: "0.75rem",
          color: "#8b949e",
        }}
      >
        📁 <span style={{ color: "#79c0ff" }}>{d.data_path}</span>
      </div>
    </div>
  );
}
