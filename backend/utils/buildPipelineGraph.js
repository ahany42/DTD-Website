export const buildPipelineGraph = (stages) => {
  const nodes = stages.map((stage, index) => ({
    id: stage,
    type: "circle",
    position: {
      x: 300,
      y: index * 180,
    },
    data: {
      label: stage
        .replace("run_", "")
        .replaceAll("_", " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
    },
  }));

  const edges = stages.slice(1).map((stage, index) => ({
    id: `edge-${index}`,
    source: stages[index],
    target: stage,
  }));

  return { nodes, edges };
};