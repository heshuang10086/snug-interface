
import React from 'react';
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilePreview from './preview/FilePreview';

interface FileUploadProps {
  id: string;
  accept: string;
  file: File | null;
  isUploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
  type: 'video' | 'thumbnail' | 'ppt';
}

const FileUpload = ({
  id,
  accept,
  file,
  isUploading,
  onFileSelect,
  title,
  description,
  type
}: FileUploadProps) => {
  return (
    <div className="border-2 border-dashed rounded-lg p-6">
      <div className={`space-y-4 ${file ? 'hidden' : 'block'}`}>
        <div className="flex justify-center">
          <Upload className="h-12 w-12 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
      </div>

      <FilePreview 
        file={file}
        type={type}
        isUploading={isUploading}
      />

      <div className="mt-4 flex justify-center">
        <input
          type="file"
          accept={accept}
          onChange={onFileSelect}
          className="hidden"
          id={id}
        />
        <Button 
          variant="outline" 
          onClick={() => document.getElementById(id)?.click()}
          disabled={isUploading}
        >
          {file ? '重新选择' : '选择文件'}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
