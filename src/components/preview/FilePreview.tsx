
import React from 'react';
import { FileText, File, Video, Image, Loader2 } from 'lucide-react';

interface FilePreviewProps {
  file: File | null;
  type: 'video' | 'thumbnail' | 'ppt';
  isUploading: boolean;
}

const FilePreview = ({ file, type, isUploading }: FilePreviewProps) => {
  if (!file) return null;

  if (isUploading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">正在上传 {file.name}...</span>
      </div>
    );
  }

  const renderPreview = () => {
    switch (type) {
      case 'video':
        return (
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
        );
      case 'thumbnail':
        return (
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-md">
              <img
                src={URL.createObjectURL(file)}
                alt="缩略图预览"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
        );
      case 'ppt':
        return (
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <File className="h-5 w-5" />
            <span className="text-sm">{file.name}</span>
          </div>
        );
    }
  };

  return (
    <div className="mt-2 rounded-lg border bg-gray-50 p-3">
      {renderPreview()}
    </div>
  );
};

export default FilePreview;
