const dataJson = `{
  "meta": [
    {
      "title": "Dataset Name",
      "value": "Titanic-Dataset_raw"
    },
    {
      "title": "Run Type",
      "value": "raw"
    },
    {
      "title": "Timestamp",
      "value": "2026-03-10T03:55:04.338160"
    }
  ],
  "summary": [
    {
      "title": "N Rows",
      "value": 891
    },
    {
      "title": "N Columns",
      "value": 12
    },
    {
      "title": "Column Types",
      "value": [
        {
          "title": "Numerical",
          "value": [
            "PassengerId",
            "Survived",
            "Pclass",
            "Age",
            "SibSp",
            "Parch",
            "Fare"
          ]
        },
        {
          "title": "Categorical",
          "value": [
            "Name",
            "Sex",
            "Ticket",
            "Cabin",
            "Embarked"
          ]
        },
        {
          "title": "Datetime",
          "value": []
        },
        {
          "title": "Boolean",
          "value": []
        }
      ]
    },
    {
      "title": "Memory Usage Mb",
      "value": 0.28
    },
    {
      "title": "Duplicate Rows",
      "value": 0
    },
    {
      "title": "Target Column",
      "value": "Survived"
    },
    {
      "title": "Target Dtype",
      "value": "int64"
    }
  ],
  "target_analysis": [
    {
      "title": "Column",
      "value": "Survived"
    },
    {
      "title": "Dtype",
      "value": "int64"
    },
    {
      "title": "Task Type",
      "value": "classification"
    },
    {
      "title": "N Classes",
      "value": 2
    },
    {
      "title": "Is Binary",
      "value": true
    },
    {
      "title": "Class Distribution",
      "value": [
        {
          "title": "0",
          "value": 0.6162
        },
        {
          "title": "1",
          "value": 0.3838
        }
      ]
    },
    {
      "title": "Minority Class Ratio",
      "value": 0.3838
    },
    {
      "title": "Majority Class Ratio",
      "value": 0.6162
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
      "title": "Target Entropy",
      "value": 0.9607
    },
    {
      "title": "Min Samples Per Class",
      "value": 342
    },
    {
      "title": "Requires Stratification",
      "value": true
    },
    {
      "title": "Rare Class Risk",
      "value": false
    }
  ],
  "data_quality": [
    {
      "title": "Missing Values",
      "value": [
        {
          "title": "Total Missing Cells",
          "value": 866
        },
        {
          "title": "Columns With Missing",
          "value": [
            {
              "title": "Age",
              "value": [
                {
                  "title": "Missing Count",
                  "value": 177
                },
                {
                  "title": "Missing Ratio",
                  "value": 0.1987
                }
              ]
            },
            {
              "title": "Cabin",
              "value": [
                {
                  "title": "Missing Count",
                  "value": 687
                },
                {
                  "title": "Missing Ratio",
                  "value": 0.771
                }
              ]
            },
            {
              "title": "Embarked",
              "value": [
                {
                  "title": "Missing Count",
                  "value": 2
                },
                {
                  "title": "Missing Ratio",
                  "value": 0.0022
                }
              ]
            }
          ]
        },
        {
          "title": "N Columns With Missing",
          "value": 3
        }
      ]
    },
    {
      "title": "Duplicates",
      "value": [
        {
          "title": "Duplicate Row Count",
          "value": 0
        },
        {
          "title": "Duplicate Ratio",
          "value": 0.0
        }
      ]
    },
    {
      "title": "Low Variance Columns",
      "value": [
        {
          "title": "Constant Columns",
          "value": []
        },
        {
          "title": "Near Constant Columns",
          "value": []
        }
      ]
    },
    {
      "title": "Unique Per Row Columns",
      "value": [
        "PassengerId",
        "Name"
      ]
    },
    {
      "title": "Type Issues",
      "value": [
        {
          "title": "Mixed Type Columns",
          "value": []
        }
      ]
    }
  ],
  "relationships": {
    "numeric_correlations": {
      "threshold": 0.5,
      "strong_pairs": [
        {
          "feature_1": "Pclass",
          "feature_2": "Fare",
          "correlation": -0.549
        }
      ]
    },
    "target_relationships": {
      "target_type": "numeric",
      "feature_correlations": {
        "PassengerId": -0.005,
        "Pclass": -0.338,
        "Age": -0.077,
        "SibSp": -0.035,
        "Parch": 0.082,
        "Fare": 0.257
      }
    }
  },
  "columns": {
    "PassengerId": {
      "data_type": "numeric",
      "dtype": "int64",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 891,
      "is_unique_per_row": true,
      "mean": 446.0,
      "std": 257.3538,
      "min": 1.0,
      "max": 891.0,
      "median": 446.0,
      "q1": 223.5,
      "q3": 668.5,
      "iqr": 445.0,
      "skewness": 0.0,
      "kurtosis": -1.2,
      "zero_count": 0,
      "outlier_count_iqr": 0,
      "outlier_ratio_iqr": 0.0,
      "is_normal": false
    },
    "Survived": {
      "data_type": "numeric",
      "dtype": "int64",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 2,
      "is_unique_per_row": false,
      "mean": 0.3838,
      "std": 0.4866,
      "min": 0.0,
      "max": 1.0,
      "median": 0.0,
      "q1": 0.0,
      "q3": 1.0,
      "iqr": 1.0,
      "skewness": 0.4785,
      "kurtosis": -1.775,
      "zero_count": 549,
      "outlier_count_iqr": 0,
      "outlier_ratio_iqr": 0.0,
      "is_normal": false
    },
    "Pclass": {
      "data_type": "numeric",
      "dtype": "int64",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 3,
      "is_unique_per_row": false,
      "mean": 2.3086,
      "std": 0.8361,
      "min": 1.0,
      "max": 3.0,
      "median": 3.0,
      "q1": 2.0,
      "q3": 3.0,
      "iqr": 1.0,
      "skewness": -0.6305,
      "kurtosis": -1.28,
      "zero_count": 0,
      "outlier_count_iqr": 0,
      "outlier_ratio_iqr": 0.0,
      "is_normal": false
    },
    "Name": {
      "data_type": "categorical",
      "dtype": "object",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 891,
      "is_unique_per_row": true,
      "top_values": {
        "Braund, Mr. Owen Harris": 1,
        "Cumings, Mrs. John Bradley (Florence Briggs Thayer)": 1,
        "Heikkinen, Miss. Laina": 1,
        "Futrelle, Mrs. Jacques Heath (Lily May Peel)": 1,
        "Allen, Mr. William Henry": 1
      },
      "is_high_cardinality": true
    },
    "Sex": {
      "data_type": "categorical",
      "dtype": "object",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 2,
      "is_unique_per_row": false,
      "top_values": {
        "male": 577,
        "female": 314
      },
      "is_high_cardinality": false
    },
    "Age": {
      "data_type": "numeric",
      "dtype": "float64",
      "missing_count": 177,
      "missing_ratio": 0.1987,
      "unique_count": 88,
      "is_unique_per_row": false,
      "mean": 29.6991,
      "std": 14.5265,
      "min": 0.42,
      "max": 80.0,
      "median": 28.0,
      "q1": 20.125,
      "q3": 38.0,
      "iqr": 17.875,
      "skewness": 0.3891,
      "kurtosis": 0.1783,
      "zero_count": 0,
      "outlier_count_iqr": 11,
      "outlier_ratio_iqr": 0.0154,
      "is_normal": false
    },
    "SibSp": {
      "data_type": "numeric",
      "dtype": "int64",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 7,
      "is_unique_per_row": false,
      "mean": 0.523,
      "std": 1.1027,
      "min": 0.0,
      "max": 8.0,
      "median": 0.0,
      "q1": 0.0,
      "q3": 1.0,
      "iqr": 1.0,
      "skewness": 3.6954,
      "kurtosis": 17.8804,
      "zero_count": 608,
      "outlier_count_iqr": 46,
      "outlier_ratio_iqr": 0.0516,
      "is_normal": false
    },
    "Parch": {
      "data_type": "numeric",
      "dtype": "int64",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 7,
      "is_unique_per_row": false,
      "mean": 0.3816,
      "std": 0.8061,
      "min": 0.0,
      "max": 6.0,
      "median": 0.0,
      "q1": 0.0,
      "q3": 0.0,
      "iqr": 0.0,
      "skewness": 2.7491,
      "kurtosis": 9.7781,
      "zero_count": 678,
      "outlier_count_iqr": 213,
      "outlier_ratio_iqr": 0.2391,
      "is_normal": false
    },
    "Ticket": {
      "data_type": "categorical",
      "dtype": "object",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 681,
      "is_unique_per_row": false,
      "top_values": {
        "347082": 7,
        "1601": 7,
        "CA. 2343": 7,
        "3101295": 6,
        "CA 2144": 6
      },
      "is_high_cardinality": true
    },
    "Fare": {
      "data_type": "numeric",
      "dtype": "float64",
      "missing_count": 0,
      "missing_ratio": 0.0,
      "unique_count": 248,
      "is_unique_per_row": false,
      "mean": 32.2042,
      "std": 49.6934,
      "min": 0.0,
      "max": 512.3292,
      "median": 14.4542,
      "q1": 7.9104,
      "q3": 31.0,
      "iqr": 23.0896,
      "skewness": 4.7873,
      "kurtosis": 33.3981,
      "zero_count": 15,
      "outlier_count_iqr": 116,
      "outlier_ratio_iqr": 0.1302,
      "is_normal": false
    },
    "Cabin": {
      "data_type": "categorical",
      "dtype": "object",
      "missing_count": 687,
      "missing_ratio": 0.771,
      "unique_count": 147,
      "is_unique_per_row": false,
      "top_values": {
        "G6": 4,
        "C23 C25 C27": 4,
        "B96 B98": 4,
        "F2": 3,
        "D": 3
      },
      "is_high_cardinality": false
    },
    "Embarked": {
      "data_type": "categorical",
      "dtype": "object",
      "missing_count": 2,
      "missing_ratio": 0.0022,
      "unique_count": 3,
      "is_unique_per_row": false,
      "top_values": {
        "S": 644,
        "C": 168,
        "Q": 77
      },
      "is_high_cardinality": false
    }
  },
  "warnings": [
    {
      "type": "high_missingness",
      "columns": [
        "Cabin"
      ],
      "message": "Columns with > 50% missing values detected."
    },
    {
      "type": "high_cardinality_categoricals",
      "columns": [
        "Name",
        "Ticket"
      ],
      "message": "High-cardinality categoricals detected."
    },
    {
      "type": "unique_per_row_columns",
      "columns": [
        "PassengerId",
        "Name"
      ],
      "message": "Likely identifier columns (unique per row)."
    },
    {
      "type": "high_outlier_ratio",
      "columns": [
        "SibSp",
        "Parch",
        "Fare"
      ],
      "message": "Numeric columns with > 5 % outliers (IQR)."
    },
    {
      "type": "non_normal_columns",
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
// import React, { useMemo } from "react";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Legend,
// } from "recharts";

// export default function RawAnalysisDashboard() {
//   const parsed = useMemo(() => JSON.parse(dataJson), []);

//   const {
//     summary,
//     target_analysis,
//     data_quality,
//     relationships,
//     columns,
//     warnings,
//   } = parsed;

//   return (
//     <div style={{ padding: 30, display: "grid", gap: 50 }}>
//       {/* SUMMARY */}
//       <section
//         style={{ padding: 20, backgroundColor: "#121212", borderRadius: 10 }}
//       >
//         <h2
//           style={{
//             color: "#ffffff",
//             borderBottom: "1px solid #444",
//             paddingBottom: 8,
//           }}
//         >
//           Summary
//         </h2>
//         <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
//           {summary.map((item) => (
//             <div
//               key={item.title}
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//                 padding: "6px 12px",
//                 backgroundColor: "#1e1e1e",
//                 borderRadius: 6,
//                 color: "#ddd",
//                 fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//                 fontSize: 14,
//               }}
//             >
//               <span style={{ fontWeight: 600, color: "#fff" }}>
//                 {item.title}
//               </span>
//               <span>{String(item.value)}</span>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section
//         style={{ padding: 20, backgroundColor: "#121212", borderRadius: 10 }}
//       >
//         <h2
//           style={{
//             color: "#ffffff",
//             borderBottom: "1px solid #444",
//             paddingBottom: 8,
//           }}
//         >
//           Target Analysis
//         </h2>

//         <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
//           {target_analysis.map((item) =>
//             item.title === "Class Distribution" ? (
//               <div
//                 key={item.title}
//                 style={{
//                   backgroundColor: "#1e1e1e",
//                   borderRadius: 6,
//                   padding: 12,
//                 }}
//               >
//                 <h3 style={{ color: "#fff", marginBottom: 8 }}>{item.title}</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={item.value}
//                       dataKey="ratio"
//                       nameKey="class"
//                       outerRadius={100}
//                       label={{ fill: "#fff" }}
//                     >
//                       {item.value.map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip
//                       contentStyle={{
//                         backgroundColor: "#1e1e1e",
//                         border: "none",
//                         color: "#fff",
//                       }}
//                       itemStyle={{ color: "#fff" }}
//                     />
//                     <Legend wrapperStyle={{ color: "#fff" }} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             ) : (
//               <div
//                 key={item.title}
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   padding: "6px 12px",
//                   backgroundColor: "#1e1e1e",
//                   borderRadius: 6,
//                   color: "#ddd",
//                   fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//                   fontSize: 14,
//                 }}
//               >
//                 <span style={{ fontWeight: 600, color: "#fff" }}>
//                   {item.title}
//                 </span>
//                 <span>{String(item.value)}</span>
//               </div>
//             )
//           )}
//         </div>
//       </section>

//       {/* FEATURE IMPORTANCE */}
//       <section>
//         <h2>Feature Importance (Cramer's V)</h2>
//         <ResponsiveContainer width="100%" height={400}>
//           <BarChart data={relationships}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="title" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar dataKey="value" fill="var(--primary-color)" />
//           </BarChart>
//         </ResponsiveContainer>
//       </section>

//       {/* COLUMNS TOP VALUES */}
//       <section>
//         <h2>Columns Top Values</h2>
//         {columns.map((col) => (
//           <div key={col.title} style={{ marginBottom: 40 }}>
//             <h4>{col.title}</h4>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={col.top_values}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="value" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="count" fill="var(--primary-color)" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         ))}
//       </section>

//       <section
//         style={{ padding: 20, backgroundColor: "#121212", borderRadius: 10 }}
//       >
//         <h2
//           style={{
//             color: "#ffffff",
//             borderBottom: "1px solid #444",
//             paddingBottom: 8,
//           }}
//         >
//           Warnings
//         </h2>

//         <div style={{ display: "grid", gap: "8px", marginTop: 12 }}>
//           {warnings.map((w, index) => (
//             <div
//               key={index}
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 padding: "8px 12px",
//                 backgroundColor: "#1e1e1e",
//                 borderRadius: 6,
//                 color: "#ddd",
//                 fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//                 fontSize: 14,
//               }}
//             >
//               <span style={{ fontWeight: 600, color: "#fff" }}>{w.type}</span>
//               <span>{w.message}</span>
//               <span style={{ fontStyle: "italic", color: "#aaa" }}>
//                 Columns: {w.columns.join(", ")}
//               </span>
//             </div>
//           ))}
//         </div>
//       </section>
//     </div>
//   );
// }
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
    relationships,
    columns,
    warnings,
  } = parsed;

  /* ----------------------------
     DATA TRANSFORMATIONS
  -----------------------------*/

  const classDistribution = useMemo(() => {
    const item = target_analysis.find(
      (i) => i.title === "Class Distribution"
    );
    return item ? item.value : [];
  }, [target_analysis]);

  const featureImportance = useMemo(() => {
    const corr =
      relationships?.target_relationships?.feature_correlations || {};

    return Object.entries(corr).map(([feature, value]) => ({
      feature,
      value,
    }));
  }, [relationships]);

  const columnList = useMemo(() => {
    return Object.entries(columns).map(([name, data]) => ({
      name,
      ...data,
      topValues: data.top_values
        ? Object.entries(data.top_values).map(([value, count]) => ({
            value,
            count,
          }))
        : null,
    }));
  }, [columns]);

  /* ----------------------------
     COMPONENT
  -----------------------------*/

  return (
    <div style={{ padding: 30, display: "grid", gap: 50 }}>

      {/* SUMMARY */}
      <section style={{ padding: 20, background: "#121212", borderRadius: 10 }}>
        <h2 style={{ color: "#fff", borderBottom: "1px solid #444", paddingBottom: 8 }}>
          Summary
        </h2>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {summary.map((item) => (
            <div
              key={item.title}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 12px",
                background: "#1e1e1e",
                borderRadius: 6,
                color: "#ddd",
              }}
            >
              <span style={{ fontWeight: 600, color: "#fff" }}>
                {item.title}
              </span>

              <span>
                {Array.isArray(item.value)
                  ? item.value.map((v) => v.title).join(", ")
                  : String(item.value)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* TARGET ANALYSIS */}
      <section style={{ padding: 20, background: "#121212", borderRadius: 10 }}>
        <h2 style={{ color: "#fff", borderBottom: "1px solid #444", paddingBottom: 8 }}>
          Target Analysis
        </h2>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {target_analysis
            .filter((i) => i.title !== "Class Distribution")
            .map((item) => (
              <div
                key={item.title}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 12px",
                  background: "#1e1e1e",
                  borderRadius: 6,
                  color: "#ddd",
                }}
              >
                <span style={{ fontWeight: 600, color: "#fff" }}>
                  {item.title}
                </span>
                <span>{String(item.value)}</span>
              </div>
            ))}
        </div>

        {/* CLASS DISTRIBUTION PIE */}
        <div style={{ marginTop: 30 }}>
          <h3 style={{ color: "#fff" }}>Class Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={classDistribution}
                dataKey="value"
                nameKey="title"
                outerRadius={100}
                label={{ fill: "#fff" }}
              >
                {classDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* FEATURE IMPORTANCE */}
      <section>
        <h2>Feature Correlation With Target</h2>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={featureImportance}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="feature" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#4BC0C0" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* COLUMNS TOP VALUES */}
      <section>
        <h2>Column Top Values</h2>

        {columnList
          .filter((col) => col.topValues)
          .map((col) => (
            <div key={col.name} style={{ marginBottom: 40 }}>
              <h4>{col.name}</h4>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={col.topValues}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="value" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#36A2EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
      </section>

      {/* WARNINGS */}
      <section style={{ padding: 20, background: "#000000", borderRadius: 10 }}>
        <h2 style={{ color: "#fff", borderBottom: "1px solid #444", paddingBottom: 8 }}>
          Warnings
        </h2>

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          {warnings.map((w, i) => (
            <div
              key={i}
              style={{
                padding: "8px 12px",
                background: "#282828",
                borderRadius: 6,
                color: "#ddd",
              }}
            >
              <strong style={{ color: "#fff" }}>{w.type}</strong>
              <div>{w.message}</div>
              <div style={{ color: "#aaa", fontStyle: "italic" }}>
                Columns: {w.columns.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}