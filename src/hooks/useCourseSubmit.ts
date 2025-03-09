
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
      // Upload files
      const [videoUpload, thumbnailUpload, pptUpload] = await Promise.all([
        videoUploader.uploadFile(video),
        thumbnailUploader.uploadFile(thumbnail),
        ppt ? pptUploader.uploadFile(ppt) : Promise.resolve(null),
      ]);

      if (!videoUpload || !thumbnailUpload) {
        throw new Error("文件上传失败");
      }

      // Insert course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          duration,
          level,
          video_url: videoUpload.urls[0], // First chunk URL
          thumbnail_url: thumbnailUpload.urls[0],
          ppt_url: pptUpload?.urls[0] || null,
          video_chunks_count: videoUpload.chunksCount
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Insert video chunks if there are multiple chunks
      if (videoUpload.urls.length > 1) {
        const chunkInserts = videoUpload.urls.map((url, index) => ({
          course_id: course.id,
          chunk_index: index,
          chunk_url: url
        }));

        const { error: chunksError } = await supabase
          .from('video_chunks')
          .insert(chunkInserts);

        if (chunksError) throw chunksError;
      }

      toast({
        title: "课程创建成功",
        description: "课程已成功创建并上传",
      });

      navigate("/");
    } catch (error: any) {
      console.error('Course creation error:', error);
      toast({
        variant: "destructive",
        title: "创建失败",
        description: error.message || "课程创建过程中出现错误，请重试",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitCourse, isSubmitting };
};
