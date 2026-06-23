import { Select } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import "./Preprocessing.css";
export default function PreprocessingVisualization({ dataJson }) {
const [selectedColumn, setSelectedColumn] = useState(
  dataJson?.column_actions?.[0]?.column || ""
);
  const getExplanation = (key, value) => {
    const explanations = {
      type: {
        numeric: "Numeric data type",
        categorical: "Categorical data type",
      },
      missing: {
        median: "Missing values handled with median",
        mode: "Missing values handled with mode",
        mean: "Missing values handled with mean",
        forward_fill: "Missing values handled with forward fill",
        backward_fill: "Missing values handled with backward fill",
      },
      outlier: {
        keep: "Outliers retained in data",
        remove: "Outliers removed from data",
        clip: "Outliers clipped to limits",
      },
      encoding: {
        onehot: "One-hot encoding applied",
        label: "Label encoding applied",
        none: "No encoding applied",
      },
    };
    return explanations[key]?.[value] || value;
  };

  const data = Array.isArray(dataJson)
    ? dataJson
    : Array.isArray(dataJson?.column_actions)
      ? dataJson?.column_actions
      : [];

  const stage = dataJson?.stage;
  const taskType = dataJson?.task_type;

useEffect(() => {
  if (data?.length > 0) {
    setSelectedColumn(data[0].column);
  }
}, [data]);

  return (
    <div className="stat-container">
      {taskType && (
        <div className="stat-sub-container">
          <span className="stat-title">Preprocessing Actions</span>
          <div className="card task-type-card">
            <span className="task-type-label">Task Type</span>
            <span className="task-type-value">
              {taskType.charAt(0).toUpperCase() +
                taskType.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      )}
<div className="stat-sub-container">
  <span className="stat-title">Column Configuration</span>

  <div className="card">
    <label className="column-selector-label">
      Choose a column
    </label>

    <Select.Root
      value={selectedColumn}
      onValueChange={setSelectedColumn}
    >
      <Select.Trigger
        className="column-selector"
        variant="soft"
        color="gray"
      />

      <Select.Content>
        {data.map((col) => (
          <Select.Item
            key={col.column}
            value={col.column}
          >
            {col.column}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>

    {/* Selected column details */}
    
    {/* Selected column details */}
{data?.length > 0 ? (
  data
    .filter((col) => col.column === selectedColumn)
    .map((col) => (
        <div
        key={col.column}
        className="preprocessing-content"
      >
        <div>
          <span className="primary-color">Action:</span> {col.action}
        </div>

        <div>
          <span className="primary-color">Reason:</span> {col.reason}
        </div>

        {col.details &&
          Object.entries(col.details).map(([key, value]) => (
            <div key={key}>
              <span className="primary-color">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </span>{" "}
              {getExplanation(key, value)}
            </div>
          ))}
      </div>
    ))
) : (
  <div className="stat-item card" style={{ marginTop: "20px" }}>
    <span className="item-title">
      No preprocessing actions available
    </span>
  </div>
)}
            
  </div>
</div>

    </div>
  );
}
