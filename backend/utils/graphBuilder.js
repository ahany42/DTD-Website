export const buildGraph = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];

  const spacing = 250;

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
        label: item, // 👈 show label exactly as received
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
