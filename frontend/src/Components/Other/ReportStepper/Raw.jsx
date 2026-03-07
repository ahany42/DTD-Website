const dataJson = `{
  "meta": [
    {
      "title": "Agent",
      "value": "Titanic-Dataset_raw_analysis"
    },
    {
      "title": "Stage",
      "value": "raw"
    },
    {
      "title": "Dataset Name",
      "value": "Titanic-Dataset_raw"
    },
    {
      "title": "Timestamp",
      "value": "2026-03-07T23:03:03.260901"
    }
  ],
  "summary": [
    {
      "title": "Rows",
      "value": 891
    },
    {
      "title": "Columns",
      "value": 12
    },
    {
      "title": "Memory (MB)",
      "value": 0.28
    },
    {
      "title": "Duplicate Rows",
      "value": 0
    },
    {
      "title": "Duplicate Ratio",
      "value": 0.0
    },
    {
      "title": "Target Column",
      "value": "Survived"
    },
    {
      "title": "Target Dtype",
      "value": "int64"
    },
    {
      "title": "Total Feature Count",
      "value": 11
    }
  ],
  "target_analysis": [
    {
      "title": "Task Type",
      "value": "classification"
    },
    {
      "title": "Is Binary",
      "value": true
    },
    {
      "title": "Number of Classes",
      "value": 2
    },
    {
      "title": "Imbalance Ratio",
      "value": 1.61
    },
    {
      "title": "Imbalance Severity",
      "value": "none"
    },
    {
      "title": "Entropy",
      "value": 0.9607
    },
    {
      "title": "Requires Stratification",
      "value": true
    },
    {
      "title": "Class Distribution",
      "value": [
        {
          "class": "0",
          "ratio": 0.6162
        },
        {
          "class": "1",
          "ratio": 0.3838
        }
      ]
    }
  ],
  "data_quality": [
    {
      "title": "Total Missing Cells",
      "value": 866
    },
    {
      "title": "Duplicate Count",
      "value": 0
    },
    {
      "title": "Duplicate Ratio",
      "value": 0.0
    }
  ],
  "relationships": [
    {
      "title": "PassengerId (Pearson r)",
      "value": -0.005
    },
    {
      "title": "Pclass (Pearson r)",
      "value": -0.338
    },
    {
      "title": "Age (Pearson r)",
      "value": -0.077
    },
    {
      "title": "SibSp (Pearson r)",
      "value": -0.035
    },
    {
      "title": "Parch (Pearson r)",
      "value": 0.082
    },
    {
      "title": "Fare (Pearson r)",
      "value": 0.257
    }
  ],
  "columns": [
    {
      "title": "PassengerId",
      "type": "numeric",
      "missing_count": 0,
      "unique_count": 891,
      "high_cardinality": false,
      "top_values": []
    },
    {
      "title": "Survived",
      "type": "numeric",
      "missing_count": 0,
      "unique_count": 2,
      "high_cardinality": false,
      "top_values": []
    },
    {
      "title": "Pclass",
      "type": "numeric",
      "missing_count": 0,
      "unique_count": 3,
      "high_cardinality": false,
      "top_values": []
    },
    {
      "title": "Name",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 891,
      "high_cardinality": true,
      "top_values": [
        {
          "value": "Braund, Mr. Owen Harris",
          "count": 1
        },
        {
          "value": "Cumings, Mrs. John Bradley (Florence Briggs Thayer)",
          "count": 1
        },
        {
          "value": "Heikkinen, Miss. Laina",
          "count": 1
        },
        {
          "value": "Futrelle, Mrs. Jacques Heath (Lily May Peel)",
          "count": 1
        },
        {
          "value": "Allen, Mr. William Henry",
          "count": 1
        }
      ]
    },
    {
      "title": "Sex",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 2,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "male",
          "count": 577
        },
        {
          "value": "female",
          "count": 314
        }
      ]
    },
    {
      "title": "Age",
      "type": "numeric",
      "missing_count": 177,
      "unique_count": 88,
      "high_cardinality": false,
      "top_values": []
    },
    {
      "title": "SibSp",
      "type": "numeric",
      "missing_count": 0,
      "unique_count": 7,
      "high_cardinality": false,
      "top_values": []
    },
    {
      "title": "Parch",
      "type": "numeric",
      "missing_count": 0,
      "unique_count": 7,
      "high_cardinality": false,
      "top_values": []
    },
    {
      "title": "Ticket",
      "type": "categorical",
      "missing_count": 0,
      "unique_count": 681,
      "high_cardinality": true,
      "top_values": [
        {
          "value": "347082",
          "count": 7
        },
        {
          "value": "1601",
          "count": 7
        },
        {
          "value": "CA. 2343",
          "count": 7
        },
        {
          "value": "3101295",
          "count": 6
        },
        {
          "value": "CA 2144",
          "count": 6
        }
      ]
    },
    {
      "title": "Fare",
      "type": "numeric",
      "missing_count": 0,
      "unique_count": 248,
      "high_cardinality": false,
      "top_values": []
    },
    {
      "title": "Cabin",
      "type": "categorical",
      "missing_count": 687,
      "unique_count": 147,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "G6",
          "count": 4
        },
        {
          "value": "C23 C25 C27",
          "count": 4
        },
        {
          "value": "B96 B98",
          "count": 4
        },
        {
          "value": "F2",
          "count": 3
        },
        {
          "value": "D",
          "count": 3
        }
      ]
    },
    {
      "title": "Embarked",
      "type": "categorical",
      "missing_count": 2,
      "unique_count": 3,
      "high_cardinality": false,
      "top_values": [
        {
          "value": "S",
          "count": 644
        },
        {
          "value": "C",
          "count": 168
        },
        {
          "value": "Q",
          "count": 77
        }
      ]
    }
  ],
  "warnings": [
    {
      "title": "High Missingness",
      "columns": [
        "Cabin"
      ],
      "message": "Columns with > 50% missing values detected."
    },
    {
      "title": "High Cardinality Categoricals",
      "columns": [
        "Name",
        "Ticket"
      ],
      "message": "High-cardinality categoricals detected."
    },
    {
      "title": "Unique Per Row Columns",
      "columns": [
        "PassengerId",
        "Name"
      ],
      "message": "Likely identifier columns (unique per row)."
    },
    {
      "title": "High Outlier Ratio",
      "columns": [
        "SibSp",
        "Parch",
        "Fare"
      ],
      "message": "Numeric columns with > 5 % outliers (IQR)."
    },
    {
      "title": "Non Normal Columns",
      "columns": [
        "PassengerId",
        "Survived",
        "Pclass",
        "Age",
        "SibSp",
        "Parch",
        "Fare"
      ],
      "message": "Non-normal numeric columns (Shapiro-Wilk)."
    }
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
