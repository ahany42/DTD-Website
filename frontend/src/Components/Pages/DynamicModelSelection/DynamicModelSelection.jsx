import { Badge } from "@radix-ui/themes";

const InfoRow = ({ label, value }) => (
  <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
    <span style={{ fontWeight: 600, minWidth: "160px", color: "var(--grey-color)", fontSize: "14px" }}>
      {label}
    </span>
    <span style={{ fontSize: "14px", color: "var(--font-color)" }}>{value ?? "—"}</span>
  </div>
);

const DynamicModelSelection = ({ data }) => {
  if (!data) {
    return (
      <div style={{ padding: "24px", color: "var(--grey-color)", textAlign: "center" }}>
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
        <span style={{ color: "var(--grey-color)", fontSize: "14px" }}>{data.message}</span>
      </div>

      {/* ── Plan Preview ── */}
      <div style={{ background: "var(--surface-glass)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "20px", boxShadow: "var(--shadow-sm)" }}>
        <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700, color: "var(--primary-color)" }}>
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
            <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--grey-color)" }}>
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
