import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setUploading(true);
      setProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            toast.success("Dataset uploaded successfully!");
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1
  });

  const handleAnalyze = () => {
    toast.success("Starting analysis...");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-primary-gradient bg-clip-text text-transparent">
            Upload Your Dataset
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your CSV, JSON, XLS, or XLSX file to start automated analysis
          </p>
        </div>

        <Card className="mb-8 shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Dataset Upload</span>
            </CardTitle>
            <CardDescription>
              Drag and drop your file here, or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-smooth ${
                isDragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              
              {uploadedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                  <div>
                    <p className="text-lg font-medium flex items-center justify-center space-x-2">
                      <FileText className="h-5 w-5" />
                      <span>{uploadedFile.name}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  
                  {uploading && (
                    <div className="space-y-2">
                      <Progress value={progress} className="w-full max-w-xs mx-auto" />
                      <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
                    </div>
                  )}
                  
                  {!uploading && progress === 100 && (
                    <Button onClick={handleAnalyze} className="bg-primary-gradient shadow-primary">
                      Start Analysis
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="text-lg font-medium">
                      {isDragActive ? 'Drop your file here' : 'Upload your dataset'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supports CSV, JSON, XLS, XLSX files up to 100MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Supported Formats */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5" />
              <span>Supported Formats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { ext: '.CSV', desc: 'Comma-separated values' },
                { ext: '.JSON', desc: 'JavaScript Object Notation' },
                { ext: '.XLS', desc: 'Excel 97-2003' },
                { ext: '.XLSX', desc: 'Excel 2007+' }
              ].map((format) => (
                <div key={format.ext} className="text-center p-4 rounded-lg bg-accent/50">
                  <p className="font-medium text-accent-foreground">{format.ext}</p>
                  <p className="text-xs text-muted-foreground">{format.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};