import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { Stepper } from "react-form-stepper";
import { Button } from "@radix-ui/themes";
import { useSearchParams, useParams, useLocation } from "react-router-dom";
import Raw from "../../Other/ReportStepper/Raw";
import Preprocessing from "../../Other/ReportStepper/Preprocessing";
import Clean from "../../Other/ReportStepper/Clean";
import Automl from "../../Other/ReportStepper/Automl";
import { AppContext, ReportContext } from "../../../App";
import KnowledgeGraph from "../KnowledgeGraph/KnowledgeGraph";
import Loader from "../../Other/Loader/Loader";
import { Callout } from "@radix-ui/themes";
import DynamicEDA from "../DynamicEDA/DynamicEDA";
import DynamicPreprocessing from "../DynamicPreprocessing/DynamicPreprocessing";
import DynamicFeatureEngineering from "../DynamicFeatureEngineering/DynamicFeatureEngineering";
import DynamicModelSelection from "../DynamicModelSelection/DynamicModelSelection";
import DynamicTraining from "../DynamicTraining/DynamicTraining";
import DynamicDeployment from "../DynamicDeployment/DynamicDeployment";

const connectorStyleConfig = {
  circleFontSize: "1.2rem",
  activeBgColor: "#0f766e",
  completedBgColor: "#0f766e",
  activeColor: "#0f766e",
  completedColor: "#0f766e",
  activeTextColor: "white",
  completedTextColor: "white",
  inactiveTextColor: "#64748b",
  labelColor: "#64748b",
  borderRadius: "50%",
  style: "solid",
};
const COLOR_MAP = {
  default: {
    bg: "#0f766e",
    border: "#38bdf8",
    text: "#ffffff",
    label: "Default",
  },
  active: {
    bg: "#1e3a8a",
    border: "#60a5fa",
    text: "#ffffff",
    label: "Active",
  },
  complete: {
    bg: "#14532d",
    border: "#4ade80",
    text: "#ffffff",
    label: "Complete",
  },
  completed: {
    bg: "#15803d",
    border: "#4ade80",
    text: "#ffffff",
    label: "Completed",
  },
  paused: {
    bg: "#c2410c",
    border: "#fb923c",
    text: "#ffffff",
    label: "Paused",
  },
  pending: {
    bg: "#4b5563",
    border: "#9ca3af",
    text: "#d1d5db",
    label: "Pending",
  },
  error: { bg: "#7f1d1d", border: "#f87171", text: "#ffffff", label: "Error" },
};
const dynamicComponentMap = {
  eda: { text: "EDA", component: DynamicEDA },
  preprocessing: { text: "Preprocessing", component: DynamicPreprocessing },
  feature_engineering: {
    text: "Feature Engineering",
    component: DynamicFeatureEngineering,
  },
  model_selection: {
    text: "Model Selection",
    component: DynamicModelSelection,
  },
  training: { text: "Model Training", component: DynamicTraining },
  deployment: { text: "Model Deployment", component: DynamicDeployment },
};

async function streamPostSse(url, body, onMessage) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorText = "";
    try {
      const errJson = await response.json();
      errorText = errJson.error || errJson.message;
    } catch {
      errorText = await response.text();
    }
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // keep last incomplete line in buffer

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const dataStr = line.slice(6).trim();
        if (dataStr) {
          try {
            const parsed = JSON.parse(dataStr);
            onMessage(parsed);
          } catch (err) {
            console.error(
              "[ViewReport][streamPostSse] Failed to parse SSE line:",
              line,
              err
            );
          }
        }
      }
    }
  }
}

export default function ViewReport() {
  const [activeStep, setActiveStep] = useState(0);
  const [report, setReport] = useState(null);
  const [currentDynamicReport, setCurrentDynamicReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState("");
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const mode = searchParams.get("mode");
  const { BACKEND_URL } = useContext(AppContext);
  const { reportRefreshFlag, triggerReportRefresh, error, setError } =
    useContext(ReportContext);
  const { reportId } = useParams();

  // HITL State
  const [hitlState, setHitlState] = useState(null);
  const [resuming, setResuming] = useState(false);
  const [pipelineStatus, setPipelineStatus] = useState("idle");

  const datasetId = location.state?.datasetId;

  const steps = [
    { label: "Raw Data", key: "raw_analysis" },
    { label: "Preprocessing", key: "preprocessing" },
    { label: "Clean Data", key: "clean_analysis" },
    { label: "AutoML", key: "automl_training" },
  ];

  const hasStepData = (stepKey) => {
    const data = report?.[stepKey];
    return (
      data &&
      (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)
    );
  };

  // ── Fetch dynamic report & stages ──────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setLocalError("");
    fetch(`${BACKEND_URL}/api/reports/${reportId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Report not found");
        return res.json();
      })
      .then((data) => {
        if (!data.data) throw new Error("Report is empty or missing stages");
        const doc = data.data;
        const nextReport = doc.report;
        console.log("[ViewReport] report keys:", Object.keys(nextReport ?? {}));
        setReport(nextReport);

        // Restore HITL state for existing paused reports (e.g. page refresh)
        if (
          doc.dynamic_status === "paused" &&
          doc.pipeline_state?.__paused_at__
        ) {
          setHitlState((prev) =>
            prev
              ? prev
              : {
                  status: "paused",
                  pausedAt: doc.pipeline_state.__paused_at__,
                  runId: doc.pipeline_state.__run_id__ || doc._id,
                }
          );
          setPipelineStatus("paused");
        }

        if (mode === "custom" && !currentDynamicReport) {
          const firstAvailableDynamicKey = Object.keys(
            dynamicComponentMap
          ).find((key) => nextReport?.[key]);
          if (firstAvailableDynamicKey) {
            setCurrentDynamicReport(firstAvailableDynamicKey);
          }
        }
      })
      .catch((err) => {
        setLocalError(err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [reportId, BACKEND_URL, reportRefreshFlag, setError]);

  useEffect(() => {
    if (mode === "custom" && report && !currentDynamicReport) {
      const firstAvailableDynamicKey = Object.keys(dynamicComponentMap).find(
        (key) => report[key]
      );
      if (firstAvailableDynamicKey) {
        setCurrentDynamicReport(firstAvailableDynamicKey);
      }
    }
  }, [report, mode]);

  // ── Custom Mode: Start the pipeline on mount ─────────────────────────────
  useEffect(() => {
    if (mode !== "custom" || !datasetId || !reportId) return;

    setPipelineStatus("starting");
    const eventSource = new EventSource(
      `${BACKEND_URL}/api/dataset/run-pipeline/${datasetId}/${reportId}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[ViewReport][SSE] Received pipeline update:", data);

        if (data.error) {
          setPipelineStatus("error");
          setLocalError(data.error);
          setError(data.error);
          eventSource.close();
          return;
        }

        setPipelineStatus(data.status); // running / paused / completed / error

        if (data.status === "paused") {
          setHitlState({
            status: "paused",
            pausedAt: data.agent,
            runId: data.run_id,
          });
          triggerReportRefresh();
        } else if (data.status === "completed") {
          setHitlState((prev) => ({
            ...prev,
            status: "completed",
          }));
          triggerReportRefresh();
          eventSource.close();
        }
      } catch (err) {
        console.error("[ViewReport][SSE] Parse error:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("[ViewReport][SSE] Connection error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [mode, datasetId, reportId, BACKEND_URL, triggerReportRefresh, setError]);

  // ── Enriched HITL state from fetched report ──────────────────────────────
  const enrichedHitlState = useMemo(() => {
    if (!hitlState) return null;
    const agentOutputs = {};
    Object.keys(dynamicComponentMap).forEach((key) => {
      if (report?.[key]) {
        agentOutputs[key] = report[key];
      }
    });

    const completedAgents = Object.keys(dynamicComponentMap).filter(
      (key) =>
        report?.[key] &&
        (hitlState.status !== "paused" || key !== hitlState.pausedAt)
    );

    return {
      ...hitlState,
      agentOutputs,
      completedAgents,
    };
  }, [hitlState, report]);

  // ── HITL Resuming callbacks ──────────────────────────────────────────────
  const handleAccept = useCallback(async () => {
    if (!hitlState?.runId) return;
    setResuming(true);
    setPipelineStatus("running");
    try {
      await streamPostSse(
        `${BACKEND_URL}/api/dataset/dynamic-resume/${hitlState.runId}`,
        { decision: "accept" },
        (streamData) => {
          console.log("[ViewReport][Accept] SSE update:", streamData);
          if (streamData.error) {
            setPipelineStatus("error");
            setLocalError(streamData.error);
            setError(streamData.error);
            return;
          }
          if (streamData.status === "running") {
            setPipelineStatus("running");
          } else if (streamData.status === "paused") {
            setHitlState({
              status: "paused",
              pausedAt: streamData.agent,
              runId: streamData.run_id,
            });
            triggerReportRefresh();
          } else if (streamData.status === "completed") {
            setHitlState((prev) => ({
              ...prev,
              status: "completed",
            }));
            triggerReportRefresh();
          }
        }
      );
    } catch (err) {
      console.error("Accept error:", err);
      setLocalError(err.message);
      setError(err.message || "Failed to resume pipeline");
      setPipelineStatus("error");
    } finally {
      setResuming(false);
    }
  }, [hitlState?.runId, BACKEND_URL, triggerReportRefresh, setError]);

  const handleFeedback = useCallback(
    async (text) => {
      if (!hitlState?.runId) return;
      setResuming(true);
      setPipelineStatus("running");
      try {
        await streamPostSse(
          `${BACKEND_URL}/api/dataset/dynamic-resume/${hitlState.runId}`,
          { decision: "feedback", feedback_text: text },
          (streamData) => {
            console.log("[ViewReport][Feedback] SSE update:", streamData);
            if (streamData.error) {
              setPipelineStatus("error");
              setLocalError(streamData.error);
              setError(streamData.error);
              return;
            }
            if (streamData.status === "running") {
              setPipelineStatus("running");
            } else if (streamData.status === "paused") {
              setHitlState({
                status: "paused",
                pausedAt: streamData.agent,
                runId: streamData.run_id,
              });
              triggerReportRefresh();
            } else if (streamData.status === "completed") {
              setHitlState((prev) => ({
                ...prev,
                status: "completed",
              }));
              triggerReportRefresh();
            }
          }
        );
      } catch (err) {
        console.error("Feedback error:", err);
        setLocalError(err.message);
        setError(err.message || "Failed to submit feedback");
        setPipelineStatus("error");
      } finally {
        setResuming(false);
      }
    },
    [hitlState?.runId, BACKEND_URL, triggerReportRefresh, setError]
  );

  // ── Render Status Banner ──────────────────────────────────────────────────
  const renderStatusBanner = () => {
    switch (pipelineStatus) {
      case "starting":
        return (
          <Callout.Root color="blue" style={{ margin: "10px 0" }}>
            <Callout.Text>
              🚀 Starting custom pipeline execution...
            </Callout.Text>
          </Callout.Root>
        );
      case "running":
        return (
          <Callout.Root color="teal" style={{ margin: "10px 0" }}>
            <Callout.Text
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div style={spinnerStyle} />
              ⚙️ AI Agent is currently executing. Please wait...
            </Callout.Text>
          </Callout.Root>
        );
      case "paused":
        return (
          <Callout.Root color="amber" style={{ margin: "10px 0" }}>
            <Callout.Text>
              ⏸️ Pipeline paused at{" "}
              <strong>{hitlState?.pausedAt?.toUpperCase()}</strong> stage. Click
              the orange node in the graph below to review outputs and decide.
            </Callout.Text>
          </Callout.Root>
        );
      case "completed":
        return (
          <Callout.Root color="green" style={{ margin: "10px 0" }}>
            <Callout.Text>
              ✅ Pipeline execution completed successfully! All stages are
              complete.
            </Callout.Text>
          </Callout.Root>
        );
      case "error":
        return (
          <Callout.Root color="red" style={{ margin: "10px 0" }}>
            <Callout.Text>
              ❌ Pipeline Error:{" "}
              {localError || error || "An unexpected error occurred."}
            </Callout.Text>
          </Callout.Root>
        );
      default:
        return null;
    }
  };

  const handleNext = () => {
    for (let i = activeStep + 1; i < steps.length; i++) {
      if (hasStepData(steps[i].key)) {
        setActiveStep(i);
        break;
      }
    }
  };

  const handlePrev = () => {
    for (let i = activeStep - 1; i >= 0; i--) {
      if (hasStepData(steps[i].key)) {
        setActiveStep(i);
        break;
      }
    }
  };

  if (error || localError) {
    if (mode !== "custom") {
      return <div className="page report-status-page">Report Not Found</div>;
    }
  }

  const currentStepKey = steps[activeStep].key;
  const stepData = report?.[currentStepKey];
  const rawDynamicKey =
    typeof currentDynamicReport === "string"
      ? currentDynamicReport
      : currentDynamicReport?.key ||
        currentDynamicReport?.id ||
        currentDynamicReport?.type;
  // Strip "run_" / "run" prefix so "run_training" resolves to "training"
  const currentDynamicKey =
    rawDynamicKey?.replace(/^run_?/, "") || rawDynamicKey;
  const DynamicComponent = currentDynamicKey
    ? dynamicComponentMap[currentDynamicKey]?.component
    : null;
  const dynamicStepData = currentDynamicKey
    ? (report?.[currentDynamicKey] ?? null)
    : null;

  return (
    <div className="page view-report-page">
      <div style={{ margin: "10px 0" }}>
        {mode === "custom" ? (
          <div>
            <h1 className="sub-header">Pipeline</h1>

            {renderStatusBanner()}
            <Callout.Root style={{ margin: "20px 0" }}>
              <Callout.Text>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  {Object.entries(COLOR_MAP).map(([key, value]) => (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          backgroundColor: value.bg,
                          border: `2px solid ${value.border}`,
                        }}
                      />
                      <span style={{ fontSize: "13px" }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </Callout.Text>
            </Callout.Root>
            <Callout.Root style={{ margin: "20px 0" }}>
              <Callout.Text>
                Click on the nodes to view the details of each step in the
                pipeline.
              </Callout.Text>
            </Callout.Root>

            <KnowledgeGraph
              reportId={reportId}
              currentDynamicReport={currentDynamicReport}
              setCurrentDynamicReport={setCurrentDynamicReport}
              dynamicComponentMap={dynamicComponentMap}
              hitlState={enrichedHitlState}
              onAccept={handleAccept}
              onFeedback={handleFeedback}
              resuming={resuming}
            />

            <div className="report-step-content">
              {loading ? (
                <Loader />
              ) : DynamicComponent ? (
                (() => {
                  console.log(
                    "[ViewReport] Rendering Dynamic Component:",
                    currentDynamicKey
                  );
                  return <DynamicComponent data={dynamicStepData} />;
                })()
              ) : (
                <Loader />
              )}
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div>
                <Loader />
              </div>
            ) : (
              <>
                <Stepper
                  activeStep={activeStep}
                  steps={steps}
                  styleConfig={connectorStyleConfig}
                  connectorStyleConfig={connectorStyleConfig}
                  connectorStateColors={true}
                />

                <div className="report-step-actions">
                  <Button
                    onClick={handlePrev}
                    disabled={
                      activeStep === 0 ||
                      !steps
                        .slice(0, activeStep)
                        .some((s) => hasStepData(s.key))
                    }
                    size="2"
                    variant="soft"
                    color="gray"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={
                      activeStep === steps.length - 1 ||
                      !steps
                        .slice(activeStep + 1)
                        .some((s) => hasStepData(s.key))
                    }
                    size="2"
                    variant="soft"
                    color="gray"
                  >
                    Next
                  </Button>
                </div>

                <div className="report-step-content">
                  {stepData ? (
                    (() => {
                      switch (currentStepKey) {
                        case "raw_analysis":
                          console.log(
                            "[ViewReport] Rendering Raw component:",
                            stepData
                          );
                          return <Raw data={stepData} />;
                        case "preprocessing":
                          console.log(
                            "[ViewReport] Rendering Preprocessing component:",
                            stepData
                          );
                          return <Preprocessing data={stepData} />;
                        case "clean_analysis":
                          console.log(
                            "[ViewReport] Rendering Clean component:",
                            stepData
                          );
                          return <Clean data={stepData} />;
                        case "automl_training":
                          console.log(
                            "[ViewReport] Rendering AutoML component:",
                            stepData
                          );
                          return <Automl data={stepData} />;
                        default:
                          return null;
                      }
                    })()
                  ) : (
                    <Loader />
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Simple keyframe spinner style
const spinnerStyle = {
  width: "16px",
  height: "16px",
  border: "2px solid rgba(0, 0, 0, 0.1)",
  borderTop: "2px solid currentColor",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
};

// Add standard keyframe spin for spinner inside document body or via inline style injection if needed
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}
