import { useRef, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { AppContext } from "../../../App";
import "./UploadDataset.css";
import { Button } from "@radix-ui/themes";
import { toast } from "react-toastify";
const UploadDataset = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const { BACKEND_URL } = useContext(AppContext);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("DTD_user"));
  const navigate = useNavigate();
  // Resize whenever text changes
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "40px";
    if (text) {
      el.style.height = Math.min(el.scrollHeight, 180) + "px";
    }
  }, [text]);

  const handleInput = (e) => {
    setText(e.target.value);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleDiscardFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // reset input so same file can be reselected
    }
  };

  const handleSend = async () => {
    if (!text && !file) return;

    text.replace(/[\[\]'"]/g, "").trim();
    console.log("Cleaned prompt:", text);
    const formData = new FormData();
    formData.append("prompt", text);

    if (file) {
      formData.append("file", file);
      formData.append("fileSize", file.size); // send size
      formData.append("fileName", file.name);
      formData.append("userId", user.id); // optional but useful
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/dataset/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error("Upload failed. Please try again.");
        return;
      }

      toast.success("Dataset uploaded successfully!");
      navigate(`/view-report/${data.report._id}`); // navigate to report view

      console.log("Uploaded dataset:", data);

      // get datasetId from backend response
      const datasetId = data.dataset?._id;
      console.log("Dataset ID:", datasetId);
      if (!datasetId) {
        toast.error("Dataset ID not returned from server");
        return;
      }
      // Start listening to pipeline stream
      const eventSource = new EventSource(
        `${BACKEND_URL}/api/dataset/run-pipeline/${datasetId}`
      );

      eventSource.onmessage = (event) => {
        const streamData = JSON.parse(event.data);
        console.log("Pipeline update:", streamData);

        if (streamData.status === "completed") {
          toast.success("Pipeline completed!");
          eventSource.close();
        }

        if (streamData.error) {
          toast.error(streamData.error);
          eventSource.close();
        }
      };

      eventSource.onerror = () => {
        console.error("SSE connection error");
        eventSource.close();
      };
    } catch (err) {
      toast.error(err.message || "An error occurred. Please try again.");
    }

    setText("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="page">
      <span className="allowed-files-text">
        Allowed File Formats .xls,.xlsx,.csv,.json
      </span>
      <div className="chat-input-wrapper">
        <button type="button" onClick={handleFileClick} className="circle-btn">
          <FiPaperclip size={18} />
        </button>

        {file && (
          <div className="file-preview">
            <span>{file.name}</span>
            <Button
              size="1"
              color="red"
              variant="surface"
              onClick={handleDiscardFile}
              className="discard-btn"
            >
              x
            </Button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xls,.xlsx,.csv,.json"
          hidden
        />

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          placeholder="Type a prompt..."
          rows={1}
          className="chat-textarea"
        />

        <button type="button" onClick={handleSend} className="circle-btn send">
          <FiSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default UploadDataset;
