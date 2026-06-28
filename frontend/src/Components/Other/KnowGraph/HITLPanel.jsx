/**
 * HITLPanel.jsx
 *
 * Bottom drawer shown when the pipeline pauses at a HITL checkpoint.
 * Rendered full-width, below the graph — never overlapping it.
 *   - Accept & Continue  → calls onAccept()
 *   - Give Feedback      → shows textarea, calls onFeedback(text)
 *
 * The panel has no manual close button: it is driven purely by pipeline
 * status, and disappears automatically once the user accepts or submits
 * feedback and the backend resumes the run (status moves off "paused").
 *
 * Props:
 *   agentName   (string)  — e.g. "eda", "preprocessing"
 *   onAccept    (fn)      — called when user accepts
 *   onFeedback  (fn)      — called with feedback text string
 *   resuming    (bool)    — true while waiting for backend response
 */

import { useState, useCallback } from "react";

/* ── Label helpers ─────────────────────────────────────────────────── */
const AGENT_LABELS = {
  eda: "Exploratory Data Analysis",
  preprocessing: "Preprocessing",
  feature_engineering: "Feature Engineering",
  model_selection: "Model Selection",
  training: "Model Training",
  evaluation: "Model Evaluation",
  deployment: "Deployment",
};

const humanize = (key) =>
  String(key)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/* ── Recursive value renderer ──────────────────────────────────────── */
function RenderValue({ value, depth = 0 }) {
  if (value === null || value === undefined) {
    return <span style={styles.null}>—</span>;
  }

  if (typeof value === "boolean") {
    return (
      <span
        style={{
          ...styles.badge,
          background: value ? "color-mix(in srgb, var(--green-color) 16%, var(--surface-color))" : "var(--danger-soft)",
          color: value ? "var(--green-color)" : "var(--danger-color)",
        }}
      >
        {String(value)}
      </span>
    );
  }

  if (typeof value === "number") {
    return (
      <span style={styles.number}>
        {Number.isInteger(value) ? value : value.toFixed(4)}
      </span>
    );
  }

  if (typeof value === "string") {
    if (value.length > 300) {
      return <pre style={styles.longText}>{value}</pre>;
    }
    return <span style={styles.string}>{value}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span style={styles.null}>[]</span>;

    // Array of primitives → comma-separated tags
    if (value.every((v) => typeof v !== "object" || v === null)) {
      return (
        <div style={styles.tagRow}>
          {value.map((v, i) => (
            <span key={i} style={styles.tag}>
              {String(v)}
            </span>
          ))}
        </div>
      );
    }

    // Array of objects → table-like rows
    return (
      <div style={{ ...styles.nested, marginTop: 4 }}>
        {value.map((item, i) => (
          <div key={i} style={styles.arrayItem}>
            {typeof item === "object" && item !== null ? (
              <RenderObject obj={item} depth={depth + 1} />
            ) : (
              <span style={styles.string}>{String(item)}</span>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return <RenderObject obj={value} depth={depth + 1} />;
  }

  return <span style={styles.string}>{String(value)}</span>;
}

function RenderObject({ obj, depth = 0 }) {
  const entries = Object.entries(obj ?? {});
  if (entries.length === 0) return <span style={styles.null}>{"{}"}</span>;

  return (
    <div style={depth > 0 ? styles.nested : {}}>
      {entries.map(([k, v]) => (
        <div key={k} style={styles.row}>
          <span style={styles.key}>{humanize(k)}</span>
          <div style={styles.val}>
            <RenderValue value={v} depth={depth} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main component ────────────────────────────────────────────────── */
export default function HITLPanel({
  agentName,
  agentOutput = {},
  onAccept,
  onFeedback,
  resuming = false,
}) {
  const [mode, setMode] = useState("review"); // "review" | "feedback"
  const [feedbackText, setFeedbackText] = useState("");

  const label = AGENT_LABELS[agentName] ?? humanize(agentName ?? "Agent");

  const handleFeedbackSubmit = useCallback(() => {
    if (!feedbackText.trim()) return;
    onFeedback?.(feedbackText.trim());
    setFeedbackText("");
    setMode("review");
  }, [feedbackText, onFeedback]);

  /* ── Sub-nodes rendering ─────────────────────────────────────────── */
  // If agent output has "sub_nodes" array, display them as a summary list first
  const subNodes = agentOutput?.sub_nodes;

  return (
    <div style={styles.panel} className="hitl-panel">
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div>
            <div style={styles.agentBadge}>Agent Output</div>
            <h3 style={styles.title} className="hitl-panel__title">
              {label}
            </h3>
          </div>
          <div style={styles.statusBar}>
            <span style={styles.statusDot} />
            <span style={styles.statusText}>
              Completed — awaiting your decision
            </span>
          </div>
        </div>

        {/* Actions live in the header on the wide drawer layout so the
            decision is always visible without scrolling the content. */}
        <div style={styles.headerActions}>
          {mode === "review" ? (
            <>
              <button
                style={{ ...styles.btn, ...styles.btnFeedback }}
                onClick={() => setMode("feedback")}
                disabled={resuming}
                className="hitl-btn--feedback"
              >
                💬 Give Feedback
              </button>
              <button
                style={{ ...styles.btn, ...styles.btnAccept }}
                onClick={onAccept}
                disabled={resuming}
                className="hitl-btn--accept"
              >
                {resuming ? (
                  <span>⚙️ Running…</span>
                ) : (
                  <span>✅ Accept &amp; Continue</span>
                )}
              </button>
            </>
          ) : (
            <button
              style={{ ...styles.btn, ...styles.btnCancel }}
              onClick={() => {
                setMode("review");
                setFeedbackText("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {/* Sub-nodes summary section */}
        {Array.isArray(subNodes) && subNodes.length > 0 && (
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Sub-nodes ({subNodes.length})</h4>
            <div style={styles.subNodeGrid}>
              {subNodes.map((sn, i) => (
                <div key={i} style={styles.subNodeCard}>
                  <div style={styles.subNodeName}>
                    {sn?.name ?? `Node ${i + 1}`}
                  </div>
                  {sn?.status && (
                    <span
                      style={{
                        ...styles.badge,
                        background:
                          sn.status === "completed" ? "#d1fae5" : "#fef3c7",
                        color:
                          sn.status === "completed" ? "#065f46" : "#92400e",
                      }}
                    >
                      {sn.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback form — inline in content area when active */}
        {mode === "feedback" && (
          <div style={styles.feedbackForm}>
            <p style={styles.feedbackLabel}>
              Describe what should be improved. The agent will re-run with your
              notes.
            </p>
            <div style={styles.feedbackRow}>
              <textarea
                style={styles.textarea}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="e.g. Please also compute the ROC curve and try a log transformation on the Age column."
                rows={3}
                autoFocus
              />
              <button
                style={{
                  ...styles.btn,
                  ...styles.btnSubmitFeedback,
                  ...styles.btnSubmitInline,
                }}
                onClick={handleFeedbackSubmit}
                disabled={!feedbackText.trim() || resuming}
              >
                {resuming ? "⚙️ Running…" : "🚀 Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Styles ────────────────────────────────────────────────────────── */
const styles = {
  panel: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxHeight: "38vh",
    background: "var(--surface-elevated)",
    fontFamily: "'Inter', system-ui, sans-serif",
    fontSize: "13px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
    padding: "14px 20px",
    borderBottom: "1px solid var(--border-color)",
    background: "linear-gradient(135deg, var(--primary-soft), var(--surface-muted))",
    flexShrink: 0,
    flexWrap: "wrap",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },
  agentBadge: {
    display: "inline-block",
    background: "var(--primary-soft)",
    color: "var(--primary-color)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    padding: "2px 8px",
    borderRadius: "999px",
    marginBottom: "4px",
  },
  title: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--heading-color)",
    lineHeight: 1.3,
  },
  statusBar: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    background: "color-mix(in srgb, #f59e0b 14%, var(--surface-color))",
    border: "1px solid color-mix(in srgb, #f59e0b 36%, var(--border-color))",
    borderRadius: "999px",
    flexShrink: 0,
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#f59e0b",
    flexShrink: 0,
    boxShadow: "0 0 0 3px rgba(245,158,11,0.2)",
    animation: "pulse 1.5s ease-in-out infinite",
  },
  statusText: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#b45309",
    whiteSpace: "nowrap",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "14px 20px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--grey-color)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  subNodeGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  subNodeCard: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "var(--surface-muted)",
    border: "1px solid var(--border-color)",
    borderRadius: "6px",
    padding: "4px 10px",
  },
  subNodeName: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--font-color)",
    textTransform: "capitalize",
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    padding: "5px 0",
    borderBottom: "1px solid var(--border-color)",
  },
  key: {
    flexShrink: 0,
    width: "120px",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--font-color)",
    paddingTop: "1px",
    wordBreak: "break-word",
  },
  val: {
    flex: 1,
    minWidth: 0,
    wordBreak: "break-word",
  },
  nested: {
    paddingLeft: "12px",
    borderLeft: "2px solid var(--border-color)",
  },
  arrayItem: {
    padding: "4px 0",
    borderBottom: "1px dashed var(--border-color)",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
  },
  tag: {
    background: "var(--primary-soft)",
    color: "var(--primary-color)",
    padding: "1px 8px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 500,
  },
  badge: {
    display: "inline-block",
    padding: "1px 8px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 600,
  },
  string: {
    color: "var(--font-color)",
    lineHeight: 1.5,
  },
  number: {
    color: "var(--light-blue)",
    fontWeight: 600,
    fontFamily: "monospace",
  },
  null: {
    color: "var(--muted-color)",
    fontStyle: "italic",
  },
  longText: {
    margin: 0,
    padding: "8px",
    background: "var(--surface-muted)",
    border: "1px solid var(--border-color)",
    borderRadius: "6px",
    fontSize: "11px",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    maxHeight: "160px",
    overflowY: "auto",
    fontFamily: "monospace",
    color: "var(--font-color)",
  },
  empty: {
    color: "var(--muted-color)",
    fontStyle: "italic",
    margin: 0,
  },
  btn: {
    padding: "9px 18px",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    transition: "opacity 0.15s, transform 0.1s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    whiteSpace: "nowrap",
  },
  btnAccept: {
    background: "linear-gradient(135deg, var(--green-color), var(--primary-color))",
    color: "var(--light-color)",
    boxShadow: "0 2px 8px rgba(5,150,105,0.3)",
  },
  btnFeedback: {
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "var(--light-color)",
    boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
  },
  btnCancel: {
    background: "var(--surface-muted)",
    color: "var(--font-color)",
  },
  btnSubmitFeedback: {
    background: "linear-gradient(135deg, var(--primary-color), var(--light-blue))",
    color: "var(--light-color)",
    boxShadow: "0 2px 8px rgba(99,102,241,0.3)",
  },
  btnSubmitInline: {
    flexShrink: 0,
    alignSelf: "flex-start",
  },
  feedbackForm: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  feedbackLabel: {
    margin: 0,
    fontSize: "12px",
    color: "var(--grey-color)",
  },
  textarea: {
    flex: 1,
    padding: "8px 10px",
    border: "1px solid var(--border-strong)",
    borderRadius: "6px",
    fontSize: "12px",
    fontFamily: "inherit",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    lineHeight: 1.5,
    color: "var(--font-color)",
  },
  feedbackRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
  },
};
