import "./Visualization.css";
import React from "react";
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
            <div key={i}>
              <strong>{v.title}:</strong> <RenderValue value={v.value} />
            </div>
          ) : (
            <div key={i}>{String(v)}</div>
          )
        )}
      </div>
    );
  }
  return <span>{String(value)}</span>;
}

export default function EdaVisualization({ dataJson }) {
  const parsed = JSON.parse(dataJson);

  const {
    summary,
    target_analysis,
    data_quality,
    relationships,
    columns,
    warnings,
  } = parsed;

  const relationshipData = (() => {
    const targetRel = relationships.find(r => r.title === "Target Relationships");
    if (!targetRel) return [];
    const correlations = targetRel.value.find(r => r.title === "Feature Correlations");
    if (!correlations) return [];
    return correlations.value
      .map(r => ({ title: r.title, value: Math.abs(r.value) }))
      .sort((a, b) => b.value - a.value);
  })();

  return (
    <div>
      {/* SUMMARY */}
      <section className="stat-container">
        <h2 className="stat-title">Summary</h2>
        <div className="stat-sub-container">
          {summary.map((item) => (
            <div key={item.title} className="stat-item card">
              <span className="item-title">{item.title}</span>
              <RenderValue value={item.value} />
            </div>
          ))}
        </div>
      </section>

      {/* TARGET ANALYSIS */}
      <section className="stat-container">
        <h2 className="stat-title">Target Analysis</h2>
        <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
          {target_analysis.map((item) =>
            Array.isArray(item.value) ? (
              <div key={item.title} className="stat-item card">
                <span className="item-title">{item.title}</span>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={item.value}
                      dataKey="value"
                      nameKey="title"
                      outerRadius={100}
                      label={{ fill: "#fff" }}
                    >
                      {item.value.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e1e1e",
                        border: "none",
                        color: "#fff",
                      }}
                      itemStyle={{ color: "#fff" }}
                    />
                    <Legend wrapperStyle={{ color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div key={item.title} className="stat-sub-container">
                <div className="stat-item card">
                  <span className="item-title">{item.title}</span>
                  <span>{String(item.value)}</span>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* DATA QUALITY */}
      <section className="stat-container">
        <h2>Data Quality</h2>
        <div className="stat-sub-container">
          {data_quality.map((item) => (
            <div key={item.title} className="stat-item card">
              <span className="item-title">{item.title}</span>
              <RenderValue value={item.value} />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE IMPORTANCE */}
      <section className="stat-container">
        <h2>Feature Importance</h2>
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

      {/* COLUMNS TOP VALUES */}
      <section className="stat-container">
        <h2>Columns Top Values</h2>
        {columns.filter(col => col.top_values?.length).map((col) => (
          <div key={col.column} style={{ marginBottom: 40 }}>
            <h4>{col.column}</h4>
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
        ))}
      </section>

      {/* WARNINGS */}
      <section className="stat-container">
        <h2>Warnings</h2>
        <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
          {warnings.map((w, index) => (
            <div key={index} className="card">
              <span style={{ fontWeight: 600, color: "#fff" }}>{w.type}</span>
              <span>{w.message}</span>
              <span style={{ fontStyle: "italic", color: "#aaa" }}>
                Columns: {w.columns.join(", ")}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}