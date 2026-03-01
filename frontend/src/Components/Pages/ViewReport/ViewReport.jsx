import { Stepper } from "react-form-stepper";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import Raw from "../../Other/ReportStepper/Raw";
import Clean from "../../Other/ReportStepper/Clean";
import Preprocessing from "../../Other/ReportStepper/Preprocessing";
import Automl from "../../Other/ReportStepper/Automl";
import { color } from "framer-motion";
export default function ViewReport() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "Raw Data" },
    { label: "Preprocessing" },
    { label: "Clean Data" },
    { label: "Automl" },
  ];
  const components = [<Raw />, <Preprocessing />, <Clean />, <Automl />];
  const connectorStyleConfig = {
    circleFontSize: "1.2rem",
    activeBgColor: "blue",
    completedBgColor: "blue",
    inactiveBgColor: "#ccc",
    activeColor: "blue",
    completedColor: "blue",
    activeTextColor: "#fff",
    completedTextColor: "#fff",
    inactiveTextColor: "#333",
    labelColor: "#333",
    borderRadius: "50%",
    style: "solid",
  };

  <Stepper
    steps={steps}
    connectorStyleConfig={connectorStyleConfig}
    className="stepper"
    color="#ffffff"
  />;
  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div style={{ padding: "20px" }} className="page">
      <Stepper
        activeStep={activeStep}
        steps={steps}
        styleConfig={connectorStyleConfig}
        connectorStyleConfig={connectorStyleConfig}
        connectorStateColors={true}
      />

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <Button
          onClick={handlePrev}
          disabled={activeStep === 0}
          size="2"
          variant="soft"
          color="indigo"
          aria-label="Previous"
        >
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={activeStep === steps.length - 1}
          size="2"
          variant="soft"
          color="indigo"
          aria-label="Next"
        >
          Next
        </Button>
      </div>
      <div style={{ margin: "30px 0" }}>{components[activeStep]}</div>
    </div>
  );
}
