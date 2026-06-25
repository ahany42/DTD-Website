import { useState, useEffect, useContext } from "react";
import { Stepper } from "react-form-stepper";
import { Button } from "@radix-ui/themes";
import { useSearchParams } from "react-router-dom";
import Raw from "../../Other/ReportStepper/Raw";
import Preprocessing from "../../Other/ReportStepper/Preprocessing";
import Clean from "../../Other/ReportStepper/Clean";
import Automl from "../../Other/ReportStepper/Automl";
import { AppContext, ReportContext } from "../../../App";
import { useParams } from "react-router-dom";
import KnowledgeGraph from "../KnowledgeGraph/KnowledgeGraph";
import Loader from "../../Other/Loader/Loader";
import { Callout } from "@radix-ui/themes";
import DynamicEDA from "../DynamicEDA/DynamicEDA";
import DynamicPreprocessing from "../DynamicPreprocessing/DynamicPreprocessing";
import DynamicFeatureEngineering from "../DynamicFeatureEngineering/DynamicFeatureEngineering";
import DynamicModelSelection from "../DynamicModelSelection/DynamicModelSelection";
import DynamicTraining from "../DynamicTraining/DynamicTraining";
import DynamicEvaluation from "../DynamicEvaluation/DynamicEvaluation";
import DynamicDeployment from "../DynamicDeployment/DynamicDeployment";
export default function ViewReport() {
  const [activeStep, setActiveStep] = useState(0);
  const [report, setReport] = useState(null);
  const [currentDynamicReport, setCurrentDynamicReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState("");
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode");
  const { BACKEND_URL } = useContext(AppContext);
  const { reportRefreshFlag, error, setError } = useContext(ReportContext);
  const { reportId } = useParams();

  const steps =
    mode === "quick"
      ? [
          { label: "Raw Data", key: "raw_analysis" },
          { label: "AutoML", key: "automl_training" },
        ]
      : [
          { label: "Raw Data", key: "raw_analysis" },
          { label: "Preprocessing", key: "preprocessing" },
          { label: "Clean Data", key: "clean_analysis" },
          { label: "AutoML", key: "automl_training" },
        ];

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
    evaluation: { text: "Model Evaluation", component: DynamicEvaluation },
    deployment: { text: "Model Deployment", component: DynamicDeployment },
  };
  const hasStepData = (stepKey) => {
    const data = report?.[stepKey];
    // return true if data exists and has keys or is non-null array/object
    return (
      data &&
      (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)
    );
  };

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
        const nextReport = data.data.report;
        setReport(nextReport);

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
  }, [
    reportId,
    BACKEND_URL,
    reportRefreshFlag,
    setError,
    mode,
    currentDynamicReport,
  ]);

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

  if (error || localError)
    return <div className="page report-status-page">Report Not Found</div>;

  const currentStepKey = steps[activeStep].key;
  const stepData = report?.[currentStepKey];
  const currentDynamicKey =
    typeof currentDynamicReport === "string"
      ? currentDynamicReport
      : currentDynamicReport?.key ||
        currentDynamicReport?.id ||
        currentDynamicReport?.type;
  const DynamicComponent = currentDynamicKey
    ? dynamicComponentMap[currentDynamicKey]?.component
    : null;
  const dynamicStepData = currentDynamicKey
    ? (report?.[currentDynamicKey] ?? report)
    : null;

  return (
    <div className="page view-report-page">
      <div style={{ margin: "10px 0" }}>
        {mode === "custom" ? (
          <div>
            <h1 className="sub-header">Pipeline</h1>
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
                            "[ViewReport] Rendering Automl component:",
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
