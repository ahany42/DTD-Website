import { Badge } from "@radix-ui/themes";
import "../../Other/Visualization/Visualization.css";

export default function DynamicTraining({ data }) {
  if (!data) {
    return (
      <div style={{ padding: "24px", color: "var(--grey-color)", textAlign: "center" }}>
        No training data available yet.
      </div>
    );
  }

  const dr = data.diagnostic_report ?? {};
  const m = dr.metrics ?? {};

  const problem_type = dr.problem_type ?? "N/A";
  const best_model = m.best_model ?? data.best_model ?? "N/A";
  const best_score = m.best_score ?? data.best_score ?? 0;
  const metric_name = m.metric_name ?? "accuracy";
  const training_method = m.training_method ?? data.training_method ?? "N/A";
  const optuna_trials = m.optuna_trials;
  const all_models = m.all_models ?? [];
  const all_scores = m.all_scores ?? [];
  const models_trained = m.models_trained ?? all_models.length;
  const f1 = m.test_f1_score ?? m.f1_score;
  const roc_auc = m.roc_auc;
  const cm = m.confusion_matrix ?? null;
  const sub_nodes = data.sub_nodes ?? [];

  const pct = (v) => (v != null ? (v * 100).toFixed(2) + "%" : "—");

  return (
    <div className="stat-container">

      {/* ── Header ── */}
      <h2 className="stat-title">Training Report</h2>
      <div className="stat-header-container">
        <Badge color="green" size="2" variant="surface">{problem_type}</Badge>
        <Badge color="blue" size="2" variant="surface">{training_method}</Badge>
        {optuna_trials && (
          <Badge color="teal" size="2" variant="surface">{optuna_trials} Optuna trials</Badge>
        )}
      </div>

      {/* ── Primary metrics ── */}
      <div className="grid-2">
        <div className="card">
          <div className="card-label">Test {metric_name}</div>
          <div className="score-value">{pct(best_score)}</div>
          <div style={{ fontSize: "0.75rem", color: "var(--grey-color)", marginTop: "4px" }}>
            Final score on held-out test set
          </div>
        </div>
        <div className="card">
          <div className="card-label">Best Model</div>
          <div className="card-value" style={{ fontSize: "1.2rem", fontWeight: 800 }}>{best_model}</div>
        </div>
      </div>

      {/* ── Secondary metrics ── */}
      {(f1 != null || roc_auc != null) && (
        <div className="grid-2">
          {f1 != null && (
            <div className="card">
              <div className="card-label">Test F1 Score</div>
              <div className="card-value" style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary-color)" }}>
                {pct(f1)}
              </div>
            </div>
          )}
          {roc_auc != null && (
            <div className="card">
              <div className="card-label">ROC AUC</div>
              <div className="card-value" style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary-color)" }}>
                {roc_auc.toFixed(3)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── All models ── */}
      {all_models.length > 0 && (
        <div className="card">
          <div className="card-label">
            Models Trained ({models_trained})
            <span style={{ fontWeight: 400, marginLeft: "6px", color: "var(--grey-color)", textTransform: "none", letterSpacing: 0 }}>
              — validation scores
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
            {all_models.map((model, i) => (
              <Badge
                key={model}
                variant={model === best_model ? "solid" : "surface"}
                color="teal"
                size="2"
                className="tag"
              >
                {model} — {all_scores[i] != null ? pct(all_scores[i]) : "N/A"}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* ── Confusion Matrix ── */}
      {problem_type === "classification" && cm && (
        <>
          <h2 className="stat-title">Confusion Matrix</h2>
          <div className="card">
            <div className="matrix">
              <div />
              <div className="matrix-cell matrix-header">Pred: 0</div>
              <div className="matrix-cell matrix-header">Pred: 1</div>

              <div className="matrix-cell matrix-header">Actual: 0</div>
              <div className="matrix-cell matrix-tn">{cm[0]?.[0]}</div>
              <div className="matrix-cell matrix-fp">{cm[0]?.[1]}</div>

              <div className="matrix-cell matrix-header">Actual: 1</div>
              <div className="matrix-cell matrix-fn">{cm[1]?.[0]}</div>
              <div className="matrix-cell matrix-tp">{cm[1]?.[1]}</div>
            </div>
          </div>
        </>
      )}

      {/* ── Pipeline steps ── */}
      {sub_nodes.length > 0 && (
        <>
          <h2 className="stat-title">Pipeline Steps</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sub_nodes.map((node, i) => (
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
