import { buildGraph } from "../utils/graphBuilder.js";

export const getGraph = async (req, res) => {
  try {
    const type = req.params.type || "main";

    const graph = buildGraph(type);

    return res.status(200).json(graph);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to build graph",
    });
  }
};