import React from "react";
import { AppContext } from "../../../App";
import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import PreprocessingVisualization from "../PreprocessingVisualization/PreprocessingVisualization";

const Preprocessing = () => {
  const { formatCustomTimestamp } = useContext(AppContext);
  const [dataJson, setDataJson] = useState(null);
  const { BACKEND_URL } = useContext(AppContext);
  const { reportId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${BACKEND_URL}/api/reports/${reportId}?stage=preprocessing`;
        console.log("Fetching from:", url);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to fetch preprocessing data");
        }

        const result = await response.json();

        console.log("FULL RESPONSE:", result);
        console.log("DATA ONLY:", result.data);

        setDataJson(result.data || null);
      } catch (error) {
        console.error("Error fetching preprocessing:", error);
        setDataJson(null);
      }
    };

    if (BACKEND_URL && reportId) {
      fetchData();
    }
  }, [BACKEND_URL, reportId]);

  return (
    <div>
      <h3>Preprocessing Completed</h3>

      {/* DEBUG VIEW */}
      {!dataJson && <p>No preprocessing data found</p>}

      {dataJson && (
        <>
          {/* TEMP DEBUG (remove later) */}
          <pre style={{ maxHeight: 200, overflow: "auto" }}>
            {JSON.stringify(dataJson, null, 2)}
          </pre>

          <PreprocessingVisualization dataJson={dataJson} />
        </>
      )}
    </div>
  );
};

export default Preprocessing;