export const buildGraph = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];

  const spacing = 250;

  const formatLabel = (value) =>
    String(value)
      .replace(/_/g, " ")
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  items.forEach((item, index) => {
    const nodeId = item;

    // NODE
    nodes.push({
      id: nodeId,
      position: {
        x: index * spacing,
        y: 100,
      },
      data: {
        label: formatLabel(item),
      },
      type: "circle",
    });

    // EDGE
    if (index > 0) {
      edges.push({
        id: `e${index}`,
        source: items[index - 1],
        target: item,
      });
    }
  });

  return { nodes, edges };
};
