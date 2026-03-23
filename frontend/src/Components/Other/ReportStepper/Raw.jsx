import { AppContext } from "../../../App";
import EdaVisualization from "../Visualization/EdaVisualization";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
export default function RawAnalysisDashboard() {
  const [dataJson, setDataJson] = useState({});
  const { BACKEND_URL } = useContext(AppContext);
  const { reportId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/reports/${reportId}?stage=raw_analysis`
      );

      const data = await res.json();

      setDataJson(data.data.raw_analysis);
      console.log("Fetched data:", data.data.raw_analysis);
    };

    fetchData();
  }, [BACKEND_URL, reportId]);
  return <EdaVisualization dataJson={dataJson} />;
}
