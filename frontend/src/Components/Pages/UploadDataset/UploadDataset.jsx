import { useRef, useState, useEffect } from "react";
import { FiSend, FiPaperclip, FiX } from "react-icons/fi";
import "./UploadDataset.css";
import { Button } from "@radix-ui/themes";
const UploadDataset = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleSend = () => {
    if (!text && !file) return;

    console.log("Send:", text, file);

    setText("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="page">
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
