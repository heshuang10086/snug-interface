
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { useFileUpload } from "@/hooks/useFileUpload";
import CourseMetadataForm from './CourseMetadataForm';

const CourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("beginner");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [ppt, setPpt] = useState<File | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();
  
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

  const handleVideoDuration = (duration: string) => {
    setDuration(duration);
  };

  const handleSubmit = async () => {
    if (!title || !description || !video || !thumbnail || !ppt || !level) {
      toast({
        variant: "destructive",
        title: "请填写所有必填项",
        description: "请确保已填写所有必填项并上传所需文件",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const [videoUrl, thumbnailUrl, pptUrl] = await Promise.all([
        videoUploader.uploadFile(video),
        thumbnailUploader.uploadFile(thumbnail),
        pptUploader.uploadFile(ppt),
      ]);

      if (!videoUrl || !thumbnailUrl || !pptUrl) {
        throw new Error("文件上传失败");
      }

      const { error: courseError } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          duration,
          level,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          ppt_url: pptUrl,
        });

      if (courseError) throw courseError;

      toast({
        title: "课程创建成功",
        description: "课程已成功创建并上传",
      });

      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "创建失败",
        description: "课程创建过程中出现错误，请重试",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center">
            课程视频 <span className="text-red-500">*</span>
          </label>
          <FileUpload
            id="video-upload"
            accept="video/*"
            file={video}
            isUploading={videoUploader.isUploading}
            onFileSelect={(e) => handleFileSelect(e, 'video')}
            onVideoDuration={handleVideoDuration}
            title="上传课程视频"
            description="支持MP4格式，确保高清品质上传"
            type="video"
            progress={videoUploader.progress}
          />
        </div>

        <div className="space-y-1">
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

        <div className="space-y-1">
          <label className="text-sm font-medium flex items-center">
            课程PPT <span className="text-red-500">*</span>
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

        <CourseMetadataForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          duration={duration}
          setDuration={setDuration}
          level={level}
          setLevel={setLevel}
        />

        <div className="pt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate("/")}>取消</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                创建中...
              </>
            ) : (
              '创建课程'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
