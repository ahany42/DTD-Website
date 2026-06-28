import React, { useMemo, useState } from "react";

const sampleOutput = {
  success: true,
  data: {
    status: "success",
    deployment_package_path:
      "D:\\Automl\\GP\\output\\deployment\\6a3ede72fb9227390b75cf23",
    endpoint_url: "http://localhost:8000",
    metrics: {
      best_score: 0.8972982545711643,
      metric_name: "r2_score",
      rmse: 4344.199409575235,
    },
    sub_nodes: [
      {
        name: "Initialization",
        description: "Extracted schema with 15 features.",
        status: "completed",
      },
      {
        name: "App Generation",
        description: "Generated FastAPI python serving script (api_server.py).",
        status: "completed",
      },
      {
        name: "Docker Generation",
        description: "Generated Dockerfile and requirements dependencies.",
        status: "completed",
      },
      {
        name: "Save Package",
        description:
          "Saved full deployment bundle in: output\\deployment\\6a3ede72fb9227390b75cf23.",
        status: "completed",
      },
    ],
  },
};

const featureSchema = {
  age: "",
  sex__female: "",
  sex__male: "",
  bmi: "",
  children: "",
  smoker__no: "",
  smoker__yes: "",
  region__northeast: "",
  region__northwest: "",
  region__southeast: "",
  region__southwest: "",
  fe_bmi_smoker: "",
  fe_age_children_sum: "",
  fe_age_sq: "",
  fe_age_smoker: "",
};

const styles = {
  page: {
    padding: "24px",
    background: "var(--bg-color)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  card: {
    background: "var(--surface-color)",
    borderRadius: "var(--radius-md)",
    border: "1px solid var(--border-color)",
    padding: "16px",
  },
  title: {
    margin: 0,
    fontSize: "1.35rem",
    fontWeight: 800,
    color: "var(--heading-color)",
  },
  muted: {
    color: "var(--grey-color)",
    marginTop: "10px",
    fontSize: "0.88rem",
    lineHeight: 1.7,
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    border: "1px solid var(--border-strong)",
    borderRadius: "10px",
    padding: "9px 10px",
    outline: "none",
    fontSize: "0.85rem",
    background: "var(--surface-color)",
    color: "var(--font-color)",
  },
  endpointInput: {
    width: "360px",
    maxWidth: "100%",
  },
  button: {
    border: "1px solid transparent",
    borderRadius: "10px",
    padding: "9px 14px",
    cursor: "pointer",
    background: "var(--primary-color)",
    color: "var(--light-color)",
    fontWeight: 700,
    fontSize: "0.82rem",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "12px",
    fontSize: "1rem",
    color: "var(--heading-color)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "10px",
    marginBottom: "12px",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    color: "var(--heading-color)",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  error: {
    color: "var(--danger-color)",
    background: "var(--danger-soft)",
    border: "1px solid color-mix(in srgb, var(--danger-color) 32%, var(--border-color))",
    borderRadius: "10px",
    padding: "10px",
  },
  list: {
    margin: 0,
    paddingLeft: 0,
    listStyle: "none",
    color: "var(--heading-color)",
    lineHeight: 1.5,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    padding: "2px 8px",
    fontSize: "0.72rem",
    fontWeight: 700,
    textTransform: "capitalize",
    background: "var(--surface-muted)",
    color: "var(--font-color)",
  },
  statusSuccess: {
    background: "color-mix(in srgb, var(--green-color) 16%, var(--surface-color))",
    color: "var(--green-color)",
  },
  statusFailed: {
    background: "var(--danger-soft)",
    color: "var(--danger-color)",
  },
  stepCard: {
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    background: "var(--surface-color)",
  },
};

const DynamicDeployment = () => {
  const [endpoint, setEndpoint] = useState(sampleOutput.data.endpoint_url);
  const [formData, setFormData] = useState(featureSchema);
  const [healthResult, setHealthResult] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingPredict, setLoadingPredict] = useState(false);
  const [error, setError] = useState("");

  const featureKeys = useMemo(() => Object.keys(featureSchema), []);

  const getStatusStyle = (status) => {
    if (status === "completed" || status === "success") {
      return { ...styles.statusBadge, ...styles.statusSuccess };
    }
    if (status === "failed" || status === "error") {
      return { ...styles.statusBadge, ...styles.statusFailed };
    }
    return styles.statusBadge;
  };

  const onChangeFeature = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const checkHealth = async () => {
    try {
      setError("");
      setLoadingHealth(true);
      const response = await fetch(`${endpoint}/health`);
      if (!response.ok) throw new Error("Health check failed");
      const contentType = response.headers.get("content-type") || "";
      let result;

      if (contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        result = { status: text || "ok" };
      }

      setHealthResult(result);
    } catch (e) {
      setError(e.message || "Failed to check health");
      setHealthResult(null);
    } finally {
      setLoadingHealth(false);
    }
  };

  const predict = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoadingPredict(true);

      const payload = featureKeys.reduce((acc, key) => {
        const val = parseFloat(formData[key]);
        acc[key] = Number.isNaN(val) ? 0 : val;
        return acc;
      }, {});

      const response = await fetch(`${endpoint}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Prediction request failed");
      const result = await response.json();
      setPredictionResult(result);
    } catch (e2) {
      setError(e2.message || "Prediction failed");
      setPredictionResult(null);
    } finally {
      setLoadingPredict(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Dynamic Evaluation</h2>
          <div style={styles.muted}>
            <strong>Generation Status:</strong>{" "}
            <span style={getStatusStyle(sampleOutput.data.status)}>
              {sampleOutput.data.status}
            </span>
            <br />
            <strong>Deployment Package:</strong>{" "}
            {sampleOutput.data.deployment_package_path}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.row}>
            <label htmlFor="endpoint">
              <strong>Endpoint URL:</strong>
            </label>
            <input
              id="endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              style={{ ...styles.input, ...styles.endpointInput }}
            />
            <button
              type="button"
              onClick={checkHealth}
              disabled={loadingHealth}
              style={styles.button}
            >
              {loadingHealth ? "Checking..." : "Check Health"}
            </button>
          </div>

          {healthResult && (
            <div
              style={{
                marginTop: "12px",
                color: "var(--heading-color)",
                fontSize: "0.85rem",
              }}
            >
              <strong>Health:</strong>{" "}
              <span style={getStatusStyle(healthResult.status || "success")}>
                {healthResult.status || "ok"}
              </span>
              {healthResult.metrics && (
                <div
                  style={{
                    marginTop: "6px",
                    color: "var(--grey-color)",
                  }}
                >
                  <small>
                    Best Score: {healthResult.metrics.best_score} | Metric:{" "}
                    {healthResult.metrics.metric_name} | RMSE:{" "}
                    {healthResult.metrics.rmse}
                  </small>
                </div>
              )}
              {!healthResult.metrics && (
                <div
                  style={{
                    marginTop: "6px",
                    color: "var(--grey-color)",
                    wordBreak: "break-word",
                  }}
                >
                  <small>{JSON.stringify(healthResult)}</small>
                </div>
              )}
            </div>
          )}
        </div>

        {predictionResult && (
          <div style={styles.card}>
            <div
              style={{
                marginTop: "16px",
                color: "var(--heading-color)",
                fontSize: "0.85rem",
                lineHeight: 1.8,
              }}
            >
              <strong>Prediction:</strong> {predictionResult.prediction}
              <br />
              <strong>Confidence:</strong> {predictionResult.confidence}
              <br />
              <strong>Model Version:</strong> {predictionResult.model_version}
            </div>
          </div>
        )}

        {error && (
          <div style={{ ...styles.card, ...styles.error }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Pipeline Steps</h3>
          <ul style={styles.list}>
            {sampleOutput.data.sub_nodes.map((node) => (
              <li key={node.name} style={{ marginBottom: "8px" }}>
                <div style={styles.stepCard}>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.88rem",
                        color: "var(--heading-color)",
                        marginBottom: "4px",
                      }}
                    >
                      {node.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: "var(--grey-color)",
                        lineHeight: 1.5,
                      }}
                    >
                      {node.description}
                    </div>
                  </div>
                  <span style={getStatusStyle(node.status)}>{node.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DynamicDeployment;
