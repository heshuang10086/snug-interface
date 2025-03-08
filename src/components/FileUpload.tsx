
import React from 'react';
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  id: string;
  accept: string;
  file: File | null;
  isUploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
}

const FileUpload = ({
  id,
  accept,
  file,
  isUploading,
  onFileSelect,
  title,
  description
}: FileUploadProps) => {
  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
      <div className="flex justify-center">
        {isUploading ? (
          <Loader2 className="h-12 w-12 text-gray-400 animate-spin" />
        ) : (
          <Upload className="h-12 w-12 text-gray-400" />
        )}
      </div>
      <div>
        <p className="text-sm text-gray-600">{file ? file.name : title}</p>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <input
        type="file"
        accept={accept}
        onChange={onFileSelect}
        className="hidden"
        id={id}
      />
      <Button variant="outline" onClick={() => document.getElementById(id)?.click()}>
        选择文件
      </Button>
    </div>
  );
};

export default FileUpload;
