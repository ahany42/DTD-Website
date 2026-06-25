import { Badge } from "@radix-ui/themes";

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
    <span style={{ fontWeight: 600, minWidth: "160px", color: "#64748b", fontSize: "14px" }}>
      {label}
    </span>
    <span style={{ fontSize: "14px", color: "#1e293b" }}>{value ?? "—"}</span>
  </div>
);

const DynamicModelSelection = ({ data }) => {
  if (!data) {
    return (
      <div style={{ padding: "24px", color: "#94a3b8", textAlign: "center" }}>
        No model selection data available yet.
      </div>
    );
  }

  const plan = data.plan_preview ?? {};
  const selectedModels = plan.selected_models ?? [];

  return (
    <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Status ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Badge
          color={["success", "planned"].includes(data.status) ? "green" : "red"}
          size="2"
          variant="surface"
        >
          {data.status ?? "unknown"}
        </Badge>
        <span style={{ color: "#475569", fontSize: "14px" }}>{data.message}</span>
      </div>

      {/* ── Plan Preview ── */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700, color: "#0f766e" }}>
          Selected Plan
        </h3>

        <InfoRow label="Approach" value={plan.approach} />
        <InfoRow label="Training Method" value={plan.training_method} />
        <InfoRow label="Train Tool" value={data.train_tool ?? plan.train_tool} />
        <InfoRow label="Problem Type" value={plan.problem_type} />
        <InfoRow label="Target Column" value={plan.target_column} />
        <InfoRow label="Time Preference" value={plan.time_preference} />
        <InfoRow label="HW Complexity" value={plan.hw_complexity} />

        {/* Selected Models */}
        {selectedModels.length > 0 && (
          <div style={{ marginTop: "12px" }}>
            <span style={{ fontWeight: 600, fontSize: "14px", color: "#64748b" }}>
              Selected Models
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
              {selectedModels.map((m) => (
                <Badge key={m} variant="surface" color="teal" size="2">
                  {m}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DynamicModelSelection;
