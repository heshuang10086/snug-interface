
import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import FileUpload from "@/components/FileUpload";
import { useFileUpload } from "@/hooks/useFileUpload";

interface CourseFileUploadsProps {
  video: File | null;
  setVideo: (file: File | null) => void;
  thumbnail: File | null;
  setThumbnail: (file: File | null) => void;
  ppt: File | null;
  setPpt: (file: File | null) => void;
  onVideoDuration: (duration: string) => void;
}

const CourseFileUploads = ({
  video,
  setVideo,
  thumbnail,
  setThumbnail,
  ppt,
  setPpt,
  onVideoDuration,
}: CourseFileUploadsProps) => {
  const { toast } = useToast();
  const videoUploader = useFileUpload("course-videos");
  const thumbnailUploader = useFileUpload("course-thumbnails");
  const pptUploader = useFileUpload("course-ppts");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'thumbnail' | 'ppt') => {
    const file = event.target.files?.[0];
    if (!file) return;

    switch (type) {
      case 'video':
        if (!file.type.includes('video/')) {
          toast({
            variant: "destructive",
            title: "格式错误",
            description: "请上传视频文件",
          });
          return;
        }
        setVideo(file);
        break;
      case 'thumbnail':
        if (!file.type.includes('image/')) {
          toast({
            variant: "destructive",
            title: "格式错误",
            description: "请上传图片文件",
          });
          return;
        }
        setThumbnail(file);
        break;
      case 'ppt':
        if (!file.name.endsWith('.ppt') && !file.name.endsWith('.pptx')) {
          toast({
            variant: "destructive",
            title: "格式错误",
            description: "请上传PPT文件",
          });
          return;
        }
        setPpt(file);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 transition-all duration-300 hover:translate-x-1">
        <label className="text-sm font-medium flex items-center">
          课程视频 <span className="text-red-500">*</span>
        </label>
        <FileUpload
          id="video-upload"
          accept="video/*"
          file={video}
          isUploading={videoUploader.isUploading}
          onFileSelect={(e) => handleFileSelect(e, 'video')}
          onVideoDuration={onVideoDuration}
          title="上传课程视频"
          description="支持MP4格式，确保高清品质上传"
          type="video"
          progress={videoUploader.progress}
        />
      </div>

      <div className="space-y-1 transition-all duration-300 hover:translate-x-1">
        <label className="text-sm font-medium flex items-center">
          课程封面图片 <span className="text-red-500">*</span>
        </label>
        <FileUpload
          id="thumbnail-upload"
          accept="image/*"
          file={thumbnail}
          isUploading={thumbnailUploader.isUploading}
          onFileSelect={(e) => handleFileSelect(e, 'thumbnail')}
          title="上传课程封面"
          description="推荐尺寸 16:9，支持 JPG、PNG 格式"
          type="thumbnail"
          progress={thumbnailUploader.progress}
        />
      </div>

      <div className="space-y-1 transition-all duration-300 hover:translate-x-1">
        <label className="text-sm font-medium flex items-center">
          课程PPT
        </label>
        <FileUpload
          id="ppt-upload"
          accept=".ppt,.pptx"
          file={ppt}
          isUploading={pptUploader.isUploading}
          onFileSelect={(e) => handleFileSelect(e, 'ppt')}
          title="上传课程PPT"
          description="支持PPT格式，确保高清品质上传"
          type="ppt"
          progress={pptUploader.progress}
        />
      </div>
    </div>
  );
};

export default CourseFileUploads;
