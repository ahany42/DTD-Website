import { Button } from "@radix-ui/themes";
import "./Preprocessing.css";
export default function PreprocessingVisualization({ dataJson }) {
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

  return (
    <div className="stat-container">
      <Button
        size="2"
        variant="soft"
        color="indigo"
        onClick={() => window.print()}
      >
        Download Phase Report
      </Button>
      {taskType && (
        <div className="stat-sub-container">
          <span className="stat-title">Preprocessing Actions</span>
          <div className="card">
            <span className="item-title">Task Type</span>
            <span className="metadata-value light-blue-text">
              {taskType.charAt(0).toUpperCase() +
                taskType.slice(1).toLowerCase()}
            </span>
          </div>
        </div>
      )}

      <div className="stat-sub-container">
        {data?.length > 0 ? (
          data?.map((col, index) => (
            <>
              <span className="stat-title">{col?.column}</span>
              <div key={index} className="stat-item card preprocessing-item">
                <div className="preprocessing-content">
                  <span>
                    <span className="light-blue-text">Action:</span>{" "}
                    {col?.action}
                  </span>
                  <span>
                    <span className="light-blue-text">Reason:</span>{" "}
                    {col?.reason}
                  </span>
                  {col?.details && (
                    <>
                      {Object.entries(col?.details ?? {}).map(
                        ([key, value]) => (
                          <div key={key}>
                            <span className="light-blue-text">
                              {key.charAt(0).toUpperCase() +
                                key.slice(1).toLowerCase()}
                              :
                            </span>{" "}
                            {getExplanation(key, value)}
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          ))
        ) : (
          <div className="stat-item card">
            <span className="item-title">
              No preprocessing actions available
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
