import { useState, useEffect, useContext } from "react";
import { Stepper } from "react-form-stepper";
import { Button } from "@radix-ui/themes";
import Raw from "../../Other/ReportStepper/Raw";
import Preprocessing from "../../Other/ReportStepper/Preprocessing";
import Clean from "../../Other/ReportStepper/Clean";
import Automl from "../../Other/ReportStepper/Automl";
import { AppContext, ReportContext } from "../../../App";
import { useParams } from "react-router-dom";

export default function ViewReport() {
  const [activeStep, setActiveStep] = useState(0);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const { BACKEND_URL } = useContext(AppContext);
  const { reportRefreshFlag, error, setError } = useContext(ReportContext);
  const { reportId } = useParams();

  const steps = [
    { label: "Raw Data", key: "raw_analysis" },
    { label: "Preprocessing", key: "preprocessing" },
    { label: "Clean Data", key: "clean_analysis" },
    { label: "AutoML", key: "automl_training" },
  ];

  const connectorStyleConfig = {
    circleFontSize: "1.2rem",
    activeBgColor: "blue",
    completedBgColor: "blue",
    activeColor: "blue",
    completedColor: "blue",
    activeTextColor: "white",
    completedTextColor: "white",
    inactiveTextColor: "#333",
    labelColor: "#333",
    borderRadius: "50%",
    style: "solid",
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
    fetch(`${BACKEND_URL}/api/reports/${reportId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Report not found");
        return res.json();
      })
      .then((data) => {
        if (!data.data) setError("Report is empty or missing stages");
        else {
          setReport(data.data.report);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [reportId, BACKEND_URL, reportRefreshFlag]);

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

  if (error)
    return (
      <div style={{ padding: "20px" }} className="page">
        Report Not Found
      </div>
    );

  const currentStepKey = steps[activeStep].key;
  const stepData = report?.[currentStepKey];

  return (
    <div style={{ padding: "15px" }} className="page">
      <Stepper
        activeStep={activeStep}
        steps={steps}
        styleConfig={connectorStyleConfig}
        connectorStyleConfig={connectorStyleConfig}
        connectorStateColors={true}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button
          onClick={handlePrev}
          disabled={
            activeStep === 0 ||
            !steps.slice(0, activeStep).some((s) => hasStepData(s.key))
          }
          size="2"
          variant="soft"
          color="indigo"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={
            activeStep === steps.length - 1 ||
            !steps.slice(activeStep + 1).some((s) => hasStepData(s.key))
          }
          loading={
            !(activeStep === steps.length - 1) &&
            !steps.slice(activeStep + 1).some((s) => hasStepData(s.key)) &&
            !error &&
            loading
          }
          size="2"
          variant="soft"
          color="indigo"
        >
          Next
        </Button>
        {error && <span className="page">error</span>}
      </div>

      <div style={{ margin: "30px 0" }}>
        {stepData &&
          (() => {
            switch (currentStepKey) {
              case "raw_analysis":
                return <Raw data={stepData} />;
              case "preprocessing":
                return <Preprocessing data={stepData} />;
              case "clean_analysis":
                return <Clean data={stepData} />;
              case "automl_training":
                return <Automl data={stepData} />;
              default:
                return null;
            }
          })()}
      </div>
    </div>
  );
}
