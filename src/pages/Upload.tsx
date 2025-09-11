import { Navigation } from "@/components/Navigation";
import { FileUpload } from "@/components/FileUpload";
import { Chatbot } from "@/components/Chatbot";

const Upload = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FileUpload />
      <Chatbot />
    </div>
  );
};

export default Upload;