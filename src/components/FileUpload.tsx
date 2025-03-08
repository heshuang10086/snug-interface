
import React from 'react';
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import FilePreview from './preview/FilePreview';
import { cn } from "@/lib/utils";

interface FileUploadProps {
  id: string;
  accept: string;
  file: File | null;
  isUploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
  type: 'video' | 'thumbnail' | 'ppt';
  onVideoDuration?: (duration: string) => void;
  progress?: number;
}

const FileUpload = ({
  id,
  accept,
  file,
  isUploading,
  onFileSelect,
  title,
  description,
  type,
  onVideoDuration,
  progress = 0
}: FileUploadProps) => {
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && type === 'video') {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = () => {
        const duration = video.duration;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = Math.floor(duration % 60);
        
        let durationStr = '';
        if (hours > 0) {
          durationStr += `${hours}小时`;
        }
        if (minutes > 0) {
          durationStr += `${minutes}分钟`;
        }
        if (seconds > 0 || durationStr === '') {
          durationStr += `${seconds}秒`;
        }
        
        onVideoDuration?.(durationStr);
        URL.revokeObjectURL(video.src);
      };
      
      video.src = URL.createObjectURL(selectedFile);
    }
    
    onFileSelect(event);
  };

  return (
    <div className={cn(
      "border-2 border-dashed rounded-lg p-6 transition-all duration-200",
      file ? "bg-gray-50/50" : "hover:border-primary/50 hover:bg-gray-50/50"
    )}>
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

      {isUploading && type === 'video' && (
        <div className="mt-4 space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500 text-center">{progress}% 上传中...</p>
        </div>
      )}

      <div className="mt-4 flex justify-center">
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id={id}
        />
        <Button 
          variant="outline"
          onClick={() => document.getElementById(id)?.click()}
          disabled={isUploading}
          className="hover:bg-primary hover:text-white transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              上传中...
            </>
          ) : (
            file ? '重新选择' : '选择文件'
          )}
        </Button>
      </div>
    </div>
  );
};

export default FileUpload;
