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
import React, { useMemo } from "react";
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

const COLORS = [
  "#4BC0C0",
  "#FF6384",
  "#FFCE56",
  "#36A2EB",
  "#9966FF",
  "#FF9F40",
  "#C9CBCF",
  "#00A86B",
  "#FFD700",
  "#FF4500",
];
function RenderValue({ value }) {
  if (Array.isArray(value)) {
    return (
      <div style={{ paddingLeft: 8 }}>
        {value.map((v, i) =>
          typeof v === "object" && v !== null && "title" in v ? (
            <div key={i} style={{ marginBottom: 4 }}>
              <strong>{v.title}:</strong> <RenderValue value={v.value} />
            </div>
          ) : (
            <div key={i}>{String(v)}</div>
          )
        )}
      </div>
    );
  }

  // 🔹 Split string by comma, then by colon, keeping key-value pairs together
  if (
    typeof value === "string" &&
    (value.includes(",") || value.includes(":"))
  ) {
    const parts = value.split(",").map((part) => part.trim()); // split by comma

    return (
      <div className="multi-value-container">
        {parts.map((part, i) => {
          if (part.includes(":")) {
            const [key, val] = part.split(":").map((s) => s.trim());
            if (val.length === 0) return "";
            return (
              <>
                <span className="item-sub-title">{key}:</span>
                <div key={i} className="card multi-value">
                  {val}
                </div>
              </>
            );
          }
          return (
            <div key={i} className="card multi-value">
              {part}
            </div>
          );
        })}
      </div>
    );
  }

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
  const parsed = dataJson || {};

  const summary = parsed.summary || [];
  const target_analysis = parsed.target_analysis || [];
  const data_quality = parsed.data_quality || [];
  const relationships = parsed.relationships || [];
  const columns = parsed.columns || [];
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

  return (
    <div>
      {/* SUMMARY */}
      {summary.length > 0 && (
        <section className="stat-container">
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
      {target_analysis.length > 0 && (
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
      {data_quality.length > 0 && (
        <section className="stat-container">
          <h2 className="stat-title">Data Quality</h2>

          <div className="stat-sub-container">
            {data_quality.map((item) => (
              <div key={item?.title} className="stat-item card">
                <span className="item-title">{item?.title}</span>
                <RenderValue value={item?.value} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FEATURE IMPORTANCE */}
      {relationshipData.length > 0 && (
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

      {/* COLUMNS TOP VALUES */}
      {columns.length > 0 && (
        <>
          {columns.map((col) => (
            <div key={col.column} className="stat-container">
              <h3 className="stat-title">{col.column}</h3>
              <div className="stat-sub-container">
                {prepareColumnDetails(col).map((item, i) => (
                  <div key={item?.title} className="stat-item card">
                    <span className="item-title">{item?.title}</span>
                    <RenderValue value={item?.value} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
      {columns.length > 0 && (
        <section className="stat-container">
          <h2 className="stat-title">Columns Top Values</h2>

          {columns
            .filter((col) => col?.top_values?.length)
            .map((col) => (
              <div key={col?.column} style={{ marginBottom: 40 }}>
                <h4>{col?.column}</h4>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={col?.top_values || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--primary-color)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ))}
        </section>
      )}

      {/* WARNINGS */}
      {warnings.length > 0 && (
        <section className="stat-container">
          <h2 className="stat-title">Warnings</h2>

          <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
            {warnings.map((w, index) => (
              <div key={index} className="card warning-card">
                <span style={{ fontWeight: 600, color: "#fff" }}>
                  {w?.type}
                  <br />
                </span>

                <span>{w?.message + " "}</span>

                <span style={{ fontStyle: "italic", color: "#aaa" }}>
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
