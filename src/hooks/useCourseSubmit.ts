
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useFileUpload } from "@/hooks/useFileUpload";

export const useCourseSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const videoUploader = useFileUpload("course-videos");
  const thumbnailUploader = useFileUpload("course-thumbnails");
  const pptUploader = useFileUpload("course-ppts");

  const submitCourse = async ({
    title,
    description,
    duration,
    level,
    video,
    thumbnail,
    ppt
  }: {
    title: string;
    description: string;
    duration: string;
    level: string;
    video: File | null;
    thumbnail: File | null;
    ppt: File | null;
  }) => {
    if (!title || !description || !video || !thumbnail || !level) {
      toast({
        variant: "destructive",
        title: "请填写所有必填项",
        description: "请确保已填写所有必填项并上传必需文件",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const [videoUrl, thumbnailUrl] = await Promise.all([
        videoUploader.uploadFile(video),
        thumbnailUploader.uploadFile(thumbnail),
      ]);

      let pptUrl = null;
      if (ppt) {
        pptUrl = await pptUploader.uploadFile(ppt);
      }

      if (!videoUrl || !thumbnailUrl) {
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

  return { submitCourse, isSubmitting };
};
