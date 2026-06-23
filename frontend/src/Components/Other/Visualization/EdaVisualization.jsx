import { Button, Select } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import "./Visualization.css";
const COLORS = [
  "#4BC0C0", // teal
  "#FF6384", // pink
  "#FFCE56", // yellow
  "#36A2EB", // blue
  "#9966FF", // purple
  "#FF9F40", // orange
  "#C9CBCF", // light gray
  "#00A86B", // green
  "#FFD700", // gold
  "#FF4500", // red-orange
];
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
function RenderValue({ value }) {
  // Handle array values
  if (Array.isArray(value)) {
    return (
      <div className="value-stack">
        {value.map((v, i) =>
          typeof v === "object" && v !== null && "title" in v ? (
            <div key={`${v.title}-${i}`} className="value-group">
              <span className="value-group-title">{v.title}</span>
              <RenderValue value={v.value} />
            </div>
          ) : (
            <span key={`primitive-${i}`} className="value-chip">
              {String(v)}
            </span>
          )
        )}
      </div>
    );
  }

  // Handle strings with commas or colons
  if (
    typeof value === "string" &&
    (value.includes(",") || value.includes(":"))
  ) {
    const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
    const groups = [];
    let activeGroup = null;

    parts.forEach((part) => {
      if (part.includes(":")) {
        const [key, ...rest] = part.split(":");
        const label = key.trim();
        const chipValue = rest.join(":").trim();
        activeGroup = { label, values: [] };
        if (chipValue) activeGroup.values.push(chipValue);
        groups.push(activeGroup);
        return;
      }

      if (activeGroup) {
        activeGroup.values.push(part);
      } else {
        groups.push({ label: "", values: [part] });
      }
    });

    return (
      <div className="value-groups">
        {groups.map((group, i) => (
          <div key={`${group.label}-${i}`} className="value-group">
            {group.label && (
              <span className="value-group-title">{group.label}</span>
            )}
            <div className="value-chip-list">
              {group.values.map((item) => (
                <span key={`${group.label}-${item}`} className="value-chip">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fallback for primitive values
  return <span>{String(value)}</span>;
}

const prepareColumnDetails = (column) => {
  return Object.entries(column)
    .filter(([key]) => key !== "column" && key !== "top_values") // exclude top_values
    .map(([key, value]) => {
      // Format numbers
      if (typeof value === "number") value = value.toFixed(2);

      // Make key human-readable
      const title = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return { title, value };
    });
};
const splitValue = (value) => {
  if (!value) return null;

  // First split by comma, then by colon
  return value.split(",").flatMap((part) =>
    part
      .split(":")
      .map((v) => v.trim())
      .filter((v) => v !== "")
  );
};
export default function EdaVisualization({ dataJson }) {
const [activeSection, setActiveSection] = useState("");

const parsed = dataJson || {};

  const summary = parsed.summary || [];
  const target_analysis = parsed.target_analysis || [];
  const data_quality = parsed.data_quality || [];
  const relationships = parsed.relationships || [];
  const columns = parsed.columns || [];
  const [selectedColumn, setSelectedColumn] = useState(
    columns?.[0]?.column || ""
  );

  useEffect(() => {
    if (columns?.[0]?.column) {
      setSelectedColumn(columns[0].column);
    }
  }, [columns]);
  const warnings = parsed.warnings || [];
  const relationshipData =
    relationships
      ?.find((r) => r?.title === "Target Relationships")
      ?.value?.find((r) => r?.title === "Feature Correlations")
      ?.value?.map((r) => ({
        title: r?.title,
        value: Math.abs(r?.value ?? 0),
      }))
      ?.sort((a, b) => b.value - a.value) || [];

const sections = [
  summary.length > 0 && {
    id: "summary",
    label: "Summary",
  },
  target_analysis.length > 0 && {
    id: "target",
    label: "Target Analysis",
  },
  data_quality.length > 0 && {
    id: "quality",
    label: "Data Quality",
  },
  relationshipData.length > 0 && {
    id: "importance",
    label: "Feature Importance",
  },
  columns.length > 0 && {
    id: "columns",
    label: "Columns",
  },
  columns.some((c) => c?.top_values?.length) && {
    id: "topvalues",
    label: "Top Values",
  },
  warnings.length > 0 && {
    id: "warnings",
    label: "Warnings",
  },
].filter(Boolean);

useEffect(() => {
  if (!activeSection && sections.length > 0) {
    setActiveSection(sections[0].id);
  }
}, [sections, activeSection]);

return (
    <div>
      <div className="results-navbar">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`nav-btn ${
              activeSection === section.id ? "active" : ""
            }`}
            onClick={() => setActiveSection(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* SUMMARY */}
      {activeSection === "summary" && summary.length > 0 && (
        <section className="stat-container">
          <div className="report-quick-actions">
            <Button
              size="2"
              variant="soft"
              color="green"
              onClick={() => setActiveSection("topvalues")}
            >
              Top Values
            </Button>
            <Button
              size="2"
              variant="soft"
              color="red"
              onClick={() => setActiveSection("warnings")}
            >
              Warnings
            </Button>
          </div>

          <h2 className="stat-title">Summary</h2>
          <div className="stat-sub-container">
            {summary.map((item) => (
              <div key={item?.title} className="stat-item card">
                <span className="item-title">{item?.title}</span>
                <RenderValue value={item?.value} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TARGET ANALYSIS */}
      {activeSection === "target" && target_analysis.length > 0 && (
        <section className="stat-container">
          <h2 className="stat-title">Target Analysis</h2>

          <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
            {target_analysis.map((item) =>
              Array.isArray(item?.value) ? (
                <div key={item?.title} className="stat-item card">
                  <span className="item-title">{item?.title}</span>

                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={item?.value || []}
                        dataKey="value"
                        nameKey="title"
                        outerRadius={100}
                        label={{ fill: "#fff" }}
                      >
                        {(item?.value || []).map((_, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div key={item?.title} className="stat-sub-container">
                  <div className="stat-item card">
                    <span className="item-title">{item?.title}</span>
                    <span>{String(item?.value)}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* DATA QUALITY */}
      {activeSection === "quality" && data_quality.length > 0 && (
        <section className="stat-container">
          <h2 className="stat-title">Data Quality</h2>

          <div className="stat-sub-container">
            {data_quality.map((item) => (
              <div key={item?.title} className="stat-item card data-quality-card">
                <span className="item-title">{item?.title}</span>
                <RenderValue value={item?.value} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FEATURE IMPORTANCE */}
      {activeSection === "importance" && relationshipData.length > 0 && (
        <section className="stat-container">
          <h2 className="stat-title">Feature Importance</h2>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={relationshipData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="var(--primary-color)" />
            </BarChart>
          </ResponsiveContainer>
        </section>
      )}
      {console.log("EDA COLUMNS:", columns)}
      {activeSection === "columns" && columns.length > 0 && (
        <section className="stat-container">
          <h2 className="stat-title">Columns</h2>

          <div
            style={{
              marginBottom: 16,
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <Select.Root
              value={selectedColumn}
              onValueChange={(value) => setSelectedColumn(value)}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                minWidth: 220,
              }}
            >
              <Select.Trigger
                variant="soft"
                color="gray"
                style={{ flex: 1 }}
                placeholder="Select Column"
              />
              <Select.Content>
                {columns.map((col) => (
                  <Select.Item key={col?.column} value={col?.column}>
                    {col?.column}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          {columns
            .filter((col) => col?.column === selectedColumn)
            .map((col) => (
              <div key={col.column}>
                <h3 className="stat-title">{col.column}</h3>
                <div className="stat-sub-container">
                  {prepareColumnDetails(col).map((item) => (
                    <div key={item?.title} className="stat-item card">
                      <span className="item-title">{item?.title}</span>
                      <RenderValue value={item?.value} />
                    </div>
                  ))}
                </div>{" "}
              </div>
            ))}
        </section>
      )}
      {activeSection === "topvalues" && columns.length > 0 && (
        <section className="stat-container">
          <h2 className="stat-title" id="top-values">
            Top Values
          </h2>
          {columns.map((col) =>
            col?.top_values?.length ? (
              <div key={col.column} style={{ marginTop: 24 }}>
                <h4>{col.column} Top Values</h4>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={col.top_values}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--primary-color)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : null
          )}
        </section>
      )}
      {activeSection === "warnings" && warnings.length > 0 && (
        <section className="stat-container">
          <h2 className="stat-title" id="warnings">
            Warnings
          </h2>

          <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
            {warnings.map((w, index) => (
              <div key={index} className="card warning-card">
                <span className="warning-type">
                  {w?.type}
                  <br />
                </span>

                <span>{w?.message + " "}</span>

                <span className="warning-columns">
                  Columns: {(w?.columns || []).join(" , ")}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}