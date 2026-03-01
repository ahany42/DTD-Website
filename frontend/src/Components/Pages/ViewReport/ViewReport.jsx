import { Stepper } from "react-form-stepper";
import { Button } from "@radix-ui/themes";
import { useState } from "react";
import Raw from "../../Other/ReportStepper/Raw";
import Clean from "../../Other/ReportStepper/Clean";
import Preprocessing from "../../Other/ReportStepper/Preprocessing";
import Automl from "../../Other/ReportStepper/Automl";
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
    disabledColor: "#cccccc",
    activeColor: "#1976d2",
    completedColor: "#2e7d32",
    size: 2,
    stepSize: "2.5em",
    style: "solid",
  };

  <Stepper steps={steps} connectorStyleConfig={connectorStyleConfig} />;
  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Stepper
        activeStep={activeStep}
        steps={steps}
        connectorStyleConfig={connectorStyleConfig}
      />

      <div style={{ margin: "30px 0" }}>{components[activeStep]}</div>

      <div style={{ display: "flex", gap: "10px" }}>
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
    </div>
  );
}
