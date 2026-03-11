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
  //sort relationships for eda
  const relationshipData = relationships
    .map((r) => ({
      title: r.title.split(" (")[0],
      value: r.value,
    }))
    .sort((a, b) => b.value - a.value);
  return (
    <div style={{ padding: 30, display: "grid", gap: 50 }}>
      {/* SUMMARY */}
      <section className="stat-container">
        <h2 className="stat-title">Summary</h2>
        <div className="stat-sub-container">
          {summary.map((item) => (
            <div key={item.title} className="stat-item">
              <span className="item-title">{item.title}</span>
              <span>{String(item.value)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="stat-container">
        <h2 className="stat-title">Target Analysis</h2>

        <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
          {target_analysis.map((item) =>
            item.title === "Class Distribution" ? (
              <div key={item.title} className="stat-item">
                <span className="item-title">{item.title}</span>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={item.value}
                      dataKey="ratio"
                      nameKey="class"
                      outerRadius={100}
                      label={{ fill: "#fff" }}
                    >
                      {item.value.map((entry, index) => (
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
              <div className="stat-sub-container">
                <div key={item.title} className="stat-item">
                  <span className="item-title">{item.title}</span>
                  <span>{String(item.value)}</span>
                </div>
              </div>
            )
          )}
        </div>
      </section>
      <section className="stat-container">
        <h2>Data Quality</h2>

        <div className="stat-sub-container">
          {data_quality.map((item) => (
            <div key={item.title} className="stat-item">
              <span className="item-title">{item.title}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </section>
      {/* FEATURE IMPORTANCE */}
      <section>
        <h2>Feature Importance (Cramer's V)</h2>
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
      <section>
        <h2>Columns Top Values</h2>
        {columns.map((col) => (
          <div key={col.title} style={{ marginBottom: 40 }}>
            <h4>{col.title}</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={col.top_values}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="value" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary-color)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ))}
      </section>

      <section
        style={{ padding: 20, backgroundColor: "#121212", borderRadius: 10 }}
      >
        <h2
          style={{
            color: "#ffffff",
            borderBottom: "1px solid #444",
            paddingBottom: 8,
          }}
        >
          Warnings
        </h2>

        <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
          {warnings.map((w, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "8px 12px",
                backgroundColor: "#1e1e1e",
                borderRadius: 6,
                color: "#ddd",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                fontSize: 14,
              }}
            >
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
