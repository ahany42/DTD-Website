import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiEdit3, FiZap } from "react-icons/fi";
import { toast } from "react-toastify";

const ReportGetStarted = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("quick");
  const [prompt, setPrompt] = useState("");

  const options = useMemo(
    () => [
      {
        key: "quick",
        title: "Quick Start",
        description:
          "Go directly to dataset upload and continue with the default flow.",
        icon: <FiZap />,
      },
      {
        key: "custom",
        title: "Custom",
        description: "Add a prompt and Get a tailored report.",
        icon: <FiEdit3 />,
      },
    ],
    []
  );

  const isCustom = mode === "custom";

  const handleContinue = () => {
    if (mode === "quick") {
      navigate("/upload-dataset?mode=quick");
      return;
    }

    if (!prompt.trim()) {
      toast.warn("Please enter a prompt to continue with the custom flow.");
      return;
    }

    navigate(`/upload-dataset?mode=custom`, {
      state: { prompt: prompt.trim() },
    });
  };

  return (
    <div className="upload-page">
      <div className="upload-container get-started-container">
        <div className="upload-header">
          <h1>Get Started</h1>
          <p>Choose a workflow for your report.</p>
        </div>

        <div
          role="radiogroup"
          aria-label="Report start options"
          className="workflow-options"
        >
          {options.map((option) => {
            const selected = mode === option.key;
            return (
              <button
                key={option.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setMode(option.key)}
                className={`workflow-option ${selected ? "workflow-option--selected" : ""}`}
              >
                <div>
                  <div className="workflow-option-icon">{option.icon}</div>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                </div>
                <span className="workflow-option-action">
                  {!selected && (
                    <>
                      <span>Select</span>
                      <FiArrowRight size={14} />
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {isCustom && (
          <div className="form-section">
            <div className="knowledge-graph-preview" aria-hidden="true">
              <span className="kg-node kg-node-main">Prompt</span>
              <span className="kg-edge kg-edge-one" />
              <span className="kg-edge kg-edge-two" />
              <span className="kg-node kg-node-a">Goals</span>
              <span className="kg-node kg-node-b">Dataset</span>
              <span className="kg-node kg-node-c">Report</span>
            </div>
            <label
              htmlFor="report-prompt"
              className="prompt-label"
            >
              Prompt *
            </label>
            <textarea
              id="report-prompt"
              className="prompt-textarea"
              required
              aria-required="true"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the report goal, focus area, or any special instructions..."
              rows={4}
            />
          </div>
        )}

        <button type="button" className="submit-btn" onClick={handleContinue}>
          Continue <FiArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ReportGetStarted;
