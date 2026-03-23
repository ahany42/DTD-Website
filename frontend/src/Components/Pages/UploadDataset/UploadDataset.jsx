// import { useRef, useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiSend, FiPaperclip } from "react-icons/fi";
// import { AppContext, ReportContext } from "../../../App";
// import "./UploadDataset.css";
// import { Button } from "@radix-ui/themes";
// import { toast } from "react-toastify";

// const UploadDataset = () => {
//   const [text, setText] = useState("");
//   const [file, setFile] = useState(null);
//   const { BACKEND_URL } = useContext(AppContext);
//   const { triggerReportRefresh } = useContext(ReportContext);
//   const textareaRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const user = JSON.parse(localStorage.getItem("DTD_user"));
//   const navigate = useNavigate();
//   // Resize whenever text changes
//   useEffect(() => {
//     const el = textareaRef.current;
//     if (!el) return;

//     el.style.height = "40px";
//     if (text) {
//       el.style.height = Math.min(el.scrollHeight, 180) + "px";
//     }
//   }, [text]);

//   const handleInput = (e) => {
//     setText(e.target.value);
//   };

//   const handleFileClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e) => {
//     const selected = e.target.files?.[0];
//     if (selected) setFile(selected);
//   };

//   const handleDiscardFile = () => {
//     setFile(null);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ""; // reset input so same file can be reselected
//     }
//   };

//   const handleSend = async () => {
//     if (!text && !file) return;

//     text.replace(/\[\]'"]/g, "").trim();
//     console.log("Cleaned prompt:", text);
//     const formData = new FormData();
//     formData.append("prompt", text);

//     if (file) {
//       formData.append("file", file);
//       formData.append("fileSize", file.size); // send size
//       formData.append("fileName", file.name);
//       formData.append("userId", user.id); // optional but useful
//     }

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/dataset/upload`, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();

//       if (!res.ok) {
//         toast.error("Upload failed. Please try again.");
//         return;
//       }

//       toast.success("Dataset uploaded successfully!");
//       navigate(`/view-report/${data.report._id}`); // navigate to report view

//       console.log("Uploaded dataset:", data);

//       // get datasetId from backend response
//       const datasetId = data.dataset?._id;
//       console.log("Dataset ID:", datasetId);
//       const reportId = data.report?._id;
//       console.log("Report ID:", reportId);
//       if (!datasetId) {
//         toast.error("Dataset ID not returned from server");
//         return;
//       }
//       // Start listening to pipeline stream
//       const eventSource = new EventSource(
//         `${BACKEND_URL}/api/dataset/run-pipeline/${datasetId}/${reportId}`
//       );

//       eventSource.onmessage = (event) => {
//         const streamData = JSON.parse(event.data);
//         triggerReportRefresh();
//         console.log("Pipeline update:", streamData);
//         console.log("here");
//         if (streamData.error) {
//           toast.error(streamData.error);
//           eventSource.close();
//           return;
//         }

//         // Push updates to context
//         console.log(streamData.agent);
//         if (streamData.agent && streamData.output) {
//           console.log(streamData.agent);
//           triggerReportRefresh(); // tell ViewReport to fetch new data
//         }
//         if (streamData) {
//           triggerReportRefresh();
//         }

//         if (streamData.status === "completed") {
//           toast.success("Pipeline completed!");
//           eventSource.close();
//         }
//       };

//       eventSource.onerror = () => {
//         console.error("SSE connection error");
//         eventSource.close();
//       };
//     } catch (err) {
//       toast.error(err.message || "An error occurred. Please try again.");
//     }

//     setText("");
//     setFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   return (
//     <div className="page">
//       <span className="allowed-files-text">
//         Allowed File Formats .xls,.xlsx,.csv,.json
//       </span>
//       <div className="chat-input-wrapper">
//         <button type="button" onClick={handleFileClick} className="circle-btn">
//           <FiPaperclip size={18} />
//         </button>

//         {file && (
//           <div className="file-preview">
//             <span>{file.name}</span>
//             <Button
//               size="1"
//               color="red"
//               variant="surface"
//               onClick={handleDiscardFile}
//               className="discard-btn"
//             >
//               x
//             </Button>
//           </div>
//         )}

//         <input
//           type="file"
//           ref={fileInputRef}
//           onChange={handleFileChange}
//           accept=".xls,.xlsx,.csv,.json"
//           hidden
//         />

//         <textarea
//           ref={textareaRef}
//           value={text}
//           onChange={handleInput}
//           placeholder="Type a prompt..."
//           rows={1}
//           className="chat-textarea"
//         />

//         <button type="button" onClick={handleSend} className="circle-btn send">
//           <FiSend size={18} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UploadDataset;

import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUploadCloud,
  FiX,
  FiTarget,
  FiFileText,
  FiArrowRight,
} from "react-icons/fi";
import { AppContext, ReportContext } from "../../../App";
import "./UploadDataset.css";
import { toast } from "react-toastify";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const UploadDataset = () => {
  const [file, setFile] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [columns, setColumns] = useState([]);
  const [targetColumn, setTargetColumn] = useState("");
  const [isDragOverFile, setIsDragOverFile] = useState(false);
  const [isDragOverTarget, setIsDragOverTarget] = useState(false);
  const [draggingCol, setDraggingCol] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { BACKEND_URL } = useContext(AppContext);
  const { triggerReportRefresh } = useContext(ReportContext);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("DTD_user"));
  const navigate = useNavigate();

  const extractColumns = (selectedFile) => {
    const ext = selectedFile.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      Papa.parse(selectedFile, {
        preview: 1,
        header: true,
        complete: (results) => setColumns(results.meta.fields || []),
        error: () => toast.error("Could not read CSV columns"),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const wb = XLSX.read(e.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (rows.length > 0) setColumns(rows[0]);
      };
      reader.readAsArrayBuffer(selectedFile);
    } else if (ext === "json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          const first = Array.isArray(json) ? json[0] : json;
          setColumns(Object.keys(first || {}));
        } catch {
          toast.error("Could not parse JSON");
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleFileSelect = (selected) => {
    if (!selected) return;
    setFile(selected);
    setColumns([]);
    setTargetColumn("");
    extractColumns(selected);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOverFile(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.warning("Please upload a dataset file.");
      return;
    }
    if (columns.length > 0 && !targetColumn) {
      toast.warning("Please select a target column.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("prompt", prompt.replace(/[\[\]'"]/g, "").trim());
    formData.append("file", file);
    formData.append("fileSize", file.size);
    formData.append("fileName", file.name);
    formData.append("userId", user.id);

    if (targetColumn) formData.append("targetColumn", targetColumn);

    try {
      const res = await fetch(`${BACKEND_URL}/api/dataset/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error("Upload failed. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Dataset uploaded successfully!");
      navigate(`/view-report/${data.report._id}`);
      console.log("Uploaded dataset:", data);

      // get datasetId from backend response
      const datasetId = data.dataset?._id;
      const reportId = data.report?._id;
      console.log("Dataset ID:", datasetId);
      console.log("Report ID:", reportId);
      if (!datasetId) {
        toast.error("Dataset ID missing");
        setIsLoading(false);
        return;
      }

      const eventSource = new EventSource(
        `${BACKEND_URL}/api/dataset/run-pipeline/${datasetId}/${reportId}`
      );
      eventSource.onmessage = (event) => {
        const streamData = JSON.parse(event.data);
        triggerReportRefresh();
        console.log("Pipeline update:", streamData);
        if (streamData.error) {
          toast.error(streamData.error);
          eventSource.close();
          return;
        }

        // Push updates to context
        console.log(streamData.agent);
        if (streamData.agent && streamData.output) {
          console.log(streamData.agent);
          triggerReportRefresh(); // tell ViewReport to fetch new data
        }
        if (streamData) {
          triggerReportRefresh();
        }

        if (streamData.status === "completed") {
          toast.success("Pipeline completed!");
          eventSource.close();
        }
      };
      eventSource.onerror = () => eventSource.close();
    } catch (err) {
      toast.error(err.message || "An error occurred.");
      setIsLoading(false);
    }
    //     setText("");
    //     setFile(null);
    //     if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-header">
          <h1 className="upload-title">New Dataset</h1>
          <p className="upload-subtitle">
            Upload your data and configure the target
          </p>
        </div>

        {/* Step 1 — File Upload */}
        <div className="form-section">
          <label className="section-label">
            <span className="step-num">01</span> Dataset File
          </label>
          <div
            className={`file-dropzone ${isDragOverFile ? "dropzone-active" : ""} ${file ? "dropzone-filled" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOverFile(true);
            }}
            onDragLeave={() => setIsDragOverFile(false)}
            onDrop={handleFileDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e.target.files?.[0])}
              accept=".xls,.xlsx,.csv,.json"
              hidden
            />
            {file ? (
              <div className="file-info">
                <FiFileText size={22} className="file-icon" />
                <div className="file-meta">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  className="remove-file"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setColumns([]);
                    setTargetColumn("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <div className="dropzone-empty">
                <FiUploadCloud size={32} className="upload-icon" />
                <span className="dropzone-text">
                  Drop file here or <u>browse</u>
                </span>
                <span className="dropzone-hint">
                  .xls · .xlsx · .csv · .json
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Step 2 — Target Column (shown after columns parsed) */}
        {columns.length > 0 && (
          <div className="form-section">
            <label className="section-label">
              <span className="step-num">02</span> Target Column
            </label>
            <p className="section-hint">
              Drag a column pill into the target box, or click to select
            </p>

            <div className="columns-grid">
              {columns.map((col) => (
                <div
                  key={col}
                  className={`col-pill ${targetColumn === col ? "col-pill--selected" : ""} ${draggingCol === col ? "col-pill--dragging" : ""}`}
                  draggable
                  onDragStart={() => setDraggingCol(col)}
                  onDragEnd={() => setDraggingCol(null)}
                  onClick={() =>
                    setTargetColumn(col === targetColumn ? "" : col)
                  }
                >
                  {col}
                </div>
              ))}
            </div>

            <div
              className={`target-dropzone ${isDragOverTarget ? "target-active" : ""} ${targetColumn ? "target-filled" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOverTarget(true);
              }}
              onDragLeave={() => setIsDragOverTarget(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOverTarget(false);
                if (draggingCol) setTargetColumn(draggingCol);
              }}
            >
              {targetColumn ? (
                <div className="target-value">
                  <FiTarget size={14} />
                  <span>{targetColumn}</span>
                  <button
                    className="clear-target"
                    onClick={() => setTargetColumn("")}
                  >
                    <FiX size={13} />
                  </button>
                </div>
              ) : (
                <span className="target-placeholder">
                  {isDragOverTarget
                    ? "Release to set target →"
                    : "Drop target column here"}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — Prompt
        <div className="form-section">
          <label className="section-label">
            <span className="step-num">{columns.length > 0 ? "03" : "02"}</span>{" "}
            Prompt
            <span className="optional-tag">optional</span>
          </label>
          <textarea
            className="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your goal, any special instructions..."
            rows={3}
          />
        </div> */}

        {/* Submit */}
        <button
          className={`submit-btn ${isLoading ? "submit-loading" : ""}`}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="spinner" />
          ) : (
            <>
              Run Pipeline <FiArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadDataset;
