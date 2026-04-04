import React from "react";
import { AppContext } from "../../../App";
import { useEffect, useState, useContext } from "react";
import { data, useParams } from "react-router-dom";
const Preprocessing = () => {
  const { formatCustomTimestamp } = useContext(AppContext);
  const [dataJson, setDataJson] = useState(null);
  const { BACKEND_URL } = useContext(AppContext);
  const { reportId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/reports/${reportId}?stage=preprocessing`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch AutoML data");
        }

        const result = await response.json();
        console.log("result:", result);
        console.log("Preprocessing data fetched:", result.data);
        setDataJson(result.data || null);
      } catch (error) {
        console.error("Error fetching AutoML data:", error);
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
    <pre>{JSON.stringify(dataJson, null, 2)}</pre>
  </div>
);

};
export default Preprocessing;
