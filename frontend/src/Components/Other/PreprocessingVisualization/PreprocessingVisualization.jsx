import "./Preprocessing.css";
export default function PreprocessingVisualization({ dataJson }) {
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
        <div style={{ marginBottom: 12 }}>
          {stage && <div><strong>Stage:</strong> {stage}</div>}
          {taskType && <div><strong>Task Type:</strong> {taskType}</div>}
        </div>
      )}

      <div className="stat-sub-container">
        {data?.length > 0 ? (
          data?.map((col, index) => (
            <div key={index} className="stat-item card">
              <span className="item-title">{col?.column}</span>

              <div>
                <div><strong>Action:</strong> {col?.action}</div>
                <div><strong>Reason:</strong> {col?.reason}</div>

                {col?.details && (
                  <div style={{ marginTop: 6 }}>
                    {Object.entries(col?.details ?? {}).map(([k, v]) => (
                      <div key={k}>
                        <strong>{k}:</strong> {v}
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