const dataJson = `{
  "meta": [
    { "title": "Agent", "value": "raw_analysis" },
    { "title": "Stage", "value": "raw" },
    { "title": "Dataset Name", "value": "raw_data" },
    { "title": "Timestamp", "value": "2026-03-04T00:23:05.412377" }
  ],

  "summary": [
    { "title": "Rows", "value": 1783 },
    { "title": "Columns", "value": 12 },
    { "title": "Memory (MB)", "value": 1.21 },
    { "title": "Duplicate Rows", "value": 891 },
    { "title": "Duplicate Ratio", "value": 0.4997 },
    { "title": "Target Column", "value": "Survived" },
    { "title": "Target Dtype", "value": "object" },
    { "title": "Total Feature Count", "value": 11 }
  ],

  "target_analysis": [
    { "title": "Task Type", "value": "classification" },
    { "title": "Is Binary", "value": true },
    { "title": "Number of Classes", "value": 2 },
    { "title": "Imbalance Ratio", "value": 1.61 },
    { "title": "Imbalance Severity", "value": "none" },
    { "title": "Entropy", "value": 0.9607 },
    { "title": "Requires Stratification", "value": true },
    {
      "title": "Class Distribution",
      "value": [
        { "class": "0.0", "ratio": 0.6162 },
        { "class": "1.0", "ratio": 0.3838 }
      ]
    }
  ],

  "data_quality": [
    { "title": "Total Missing Cells", "value": 1732 },
    { "title": "Duplicate Count", "value": 891 },
    { "title": "Duplicate Ratio", "value": 0.4997 }
  ],

  "relationships": [
    { "title": "Sex (Cramer's V)", "value": 0.805 },
    { "title": "Pclass (Cramer's V)", "value": 0.747 },
    { "title": "SibSp (Cramer's V)", "value": 0.722 },
    { "title": "Parch (Cramer's V)", "value": 0.718 },
    { "title": "Embarked (Cramer's V)", "value": 0.718 },
    { "title": "PassengerId (Cramer's V)", "value": 0.0 },
    { "title": "Name (Cramer's V)", "value": 0.0 },
    { "title": "Age (Cramer's V)", "value": 0.0 },
    { "title": "Ticket (Cramer's V)", "value": 0.0 },
    { "title": "Fare (Cramer's V)", "value": 0.0 },
    { "title": "Cabin (Cramer's V)", "value": 0.0 }
  ],

  "columns": [
    {
      "title": "PassengerId",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 892,
      "high_cardinality": true,
      "top_values": [
        { "value": "891", "count": 2 },
        { "value": "1", "count": 2 },
        { "value": "2", "count": 2 },
        { "value": "3", "count": 2 },
        { "value": "4", "count": 2 }
      ]
    },
    {
      "title": "Sex",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 3,
      "high_cardinality": false,
      "top_values": [
        { "value": "male", "count": 1154 },
        { "value": "female", "count": 628 }
      ]
    },
    {
      "title": "Pclass",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 4,
      "high_cardinality": false,
      "top_values": [
        { "value": "3", "count": 982 },
        { "value": "1", "count": 432 },
        { "value": "2", "count": 368 }
      ]
    }
  ],

  "warnings": [
    { "title": "High Missingness", "columns": ["Cabin"], "message": "Columns with > 50% missing values detected." },
    { "title": "High Cardinality", "columns": ["PassengerId", "Name"], "message": "High-cardinality categoricals detected." }
  ]
}`;
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

export default function RawAnalysisDashboard() {
  const parsed = useMemo(() => JSON.parse(dataJson), []);

  const {
    summary,
    target_analysis,
    data_quality,
    relationships,
    columns,
    warnings,
  } = parsed;

  return (
    <div style={{ padding: 30, display: "grid", gap: 50 }}>
      {/* SUMMARY */}
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
          Summary
        </h2>
        <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
          {summary.map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 12px",
                backgroundColor: "#1e1e1e",
                borderRadius: 6,
                color: "#ddd",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                fontSize: 14,
              }}
            >
              <span style={{ fontWeight: 600, color: "#fff" }}>
                {item.title}
              </span>
              <span>{String(item.value)}</span>
            </div>
          ))}
        </div>
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
          Target Analysis
        </h2>

        <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
          {target_analysis.map((item) =>
            item.title === "Class Distribution" ? (
              <div
                key={item.title}
                style={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: 6,
                  padding: 12,
                }}
              >
                <h3 style={{ color: "#fff", marginBottom: 8 }}>{item.title}</h3>
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
              <div
                key={item.title}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 12px",
                  backgroundColor: "#1e1e1e",
                  borderRadius: 6,
                  color: "#ddd",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  fontSize: 14,
                }}
              >
                <span style={{ fontWeight: 600, color: "#fff" }}>
                  {item.title}
                </span>
                <span>{String(item.value)}</span>
              </div>
            )
          )}
        </div>
      </section>

      {/* FEATURE IMPORTANCE */}
      <section>
        <h2>Feature Importance (Cramer's V)</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={relationships}>
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
