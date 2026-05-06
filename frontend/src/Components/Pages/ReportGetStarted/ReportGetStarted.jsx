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
        description: "Add a prompt. Get a tailored report.",
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
      <div className="upload-container" style={{ maxWidth: 920 }}>
        <div className="upload-header">
          <h1>Get Started</h1>
          <p>Choose a workflow for your report.</p>
        </div>

        <div
          role="radiogroup"
          aria-label="Report start options"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginBottom: 24,
          }}
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
                style={{
                  width: "100%",
                  minHeight: 168,
                  background: selected
                    ? "var(--green-color)"
                    : "var(--light-color)",
                  padding: 20,
                  borderRadius: 18,
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>
                    {option.icon}
                  </div>
                  <h3 style={{ margin: 0 }}>{option.title}</h3>
                  <p style={{ margin: "10px 0 0" }}>{option.description}</p>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
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
            <label
              htmlFor="report-prompt"
              style={{ display: "block", marginBottom: 8 }}
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
