import { AppContext } from "../../../App";
import PreprocessingVisualization from "../PreprocessingVisualization/PreprocessingVisualization";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

export default function Preprocessing() {
  const [dataJson, setDataJson] = useState([]);
  const { BACKEND_URL } = useContext(AppContext);
  const { reportId } = useParams();

  const normalizePath = (value) =>
    String(value || "")
      .replace(/\\/g, "/")
      .replace(/^\/+/, "");

  const fetchJsonFromPath = async (pathValue) => {
    const normalizedPath = normalizePath(pathValue);
    if (!normalizedPath) return [];

    // Try backend-relative path first (works if backend serves Output files).
    const firstTryUrl = `${BACKEND_URL}/${normalizedPath}`;
    const firstTry = await fetch(firstTryUrl);
    if (firstTry.ok) {
      const fileJson = await firstTry.json();
      return Array.isArray(fileJson) ? fileJson : [];
    }

    return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${BACKEND_URL}/api/reports/${reportId}?stage=preprocessing`
        );

        const data = await res.json();
        const stageData = data?.data?.preprocessing ?? data?.data;

        if (Array.isArray(stageData)) {
          setDataJson(stageData);
          return;
        }

        // Some reports store preprocessing as paths, so load frontend JSON from file path.
        if (stageData && typeof stageData === "object") {
          const embedded = stageData.column_actions_frontend;
          if (Array.isArray(embedded)) {
            setDataJson(embedded);
            return;
          }

          if (typeof embedded === "string") {
            const loaded = await fetchJsonFromPath(embedded);
            setDataJson(loaded);
            return;
          }
        }

        setDataJson([]);
      } catch {
        setDataJson([]);
      }
    };

    fetchData();
  }, [BACKEND_URL, reportId]);

  return <PreprocessingVisualization dataJson={dataJson} />;
}