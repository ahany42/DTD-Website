import { Navigation } from "@/components/Navigation";
import { FileUpload } from "@/components/FileUpload";

const Upload = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FileUpload />
    </div>
  );
};

export default Upload;