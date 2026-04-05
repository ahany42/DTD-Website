import "./Preprocessing.css";
export default function PreprocessingVisualization({ dataJson }) {
  const getExplanation = (key, value) => {
    const explanations = {
      type: {
        numeric: "Numeric data type",
        categorical: "Categorical data type"
      },
      missing: {
        median: "Missing values handled with median",
        mode: "Missing values handled with mode",
        mean: "Missing values handled with mean",
        forward_fill: "Missing values handled with forward fill",
        backward_fill: "Missing values handled with backward fill"
      },
      outlier: {
        keep: "Outliers retained in data",
        remove: "Outliers removed from data",
        clip: "Outliers clipped to limits"
      },
      encoding: {
        onehot: "One-hot encoding applied",
        label: "Label encoding applied",
        none: "No encoding applied"
      }
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

  return (
    <div className="stat-container">
      <h2 className="stat-title">Preprocessing Actions</h2>
      {(stage || taskType) && (
        <div className="preprocessing-metadata">
          {stage && (
            <div className="metadata-card">
              <div className="metadata-label">Stage</div>
              <div className="metadata-value">{stage}</div>
            </div>
          )}
          {taskType && (
            <div className="metadata-card">
              <div className="metadata-label">Task Type</div>
              <div className="metadata-value">{taskType}</div>
            </div>
          )}
        </div>
      )}

      <div className="stat-sub-container">
        {data?.length > 0 ? (
          data?.map((col, index) => (
            <div key={index} className="stat-item card preprocessing-item">
              <span className="item-title">{col?.column}</span>

              <div className="preprocessing-content">
                <div><strong>Action:</strong> {col?.action}</div>
                <div><strong>Reason:</strong> {col?.reason}</div>

                {col?.details && (
                  <div className="preprocessing-details">
                    {Object.entries(col?.details ?? {}).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}:</strong> {getExplanation(key, value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="stat-item card">
            <span className="item-title">No preprocessing actions available</span>
          </div>
        )}
      </div>
    </div>
  );
}