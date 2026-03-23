import { AppContext } from "../../../App";
import EdaVisualization from "../Visualization/EdaVisualization";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
export default function CleanAnalysisDashboard() {
  const [dataJson, setDataJson] = useState({});
  const { BACKEND_URL } = useContext(AppContext);
  const { reportId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/reports/${reportId}?stage=clean_analysis`
      );

      const data = await res.json();
      console.log("clean data:", data);
      setDataJson(data.data.clean_analysis);
      console.log("Fetched data:", data.data.clean_analysis);
    };

    fetchData();
  }, [BACKEND_URL, reportId]);
  return <EdaVisualization dataJson={dataJson} />;
}
