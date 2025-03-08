import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAliyunOssUpload } from "./useAliyunOssUpload";

const MAX_FILE_SIZE = {
  video: 50 * 1024 * 1024, // 50MB for videos (Supabase limit)
  image: 5 * 1024 * 1024,  // 5MB for images
  document: 10 * 1024 * 1024 // 10MB for documents
};

export const useFileUpload = (bucketName: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const aliyunOssUploader = useAliyunOssUpload();

  const uploadFile = async (file: File) => {
    try {
      const maxSize = bucketName.includes('video') 
        ? MAX_FILE_SIZE.video 
        : bucketName.includes('image') 
          ? MAX_FILE_SIZE.image 
          : MAX_FILE_SIZE.document;

      // For videos larger than Supabase limit, use Aliyun OSS
      if (bucketName.includes('video') && file.size > maxSize) {
        console.log('Large video detected, using Aliyun OSS upload');
        return await aliyunOssUploader.uploadLargeVideo(file);
      }

      // For other files that exceed size limit
      if (file.size > maxSize) {
        const sizeInMB = maxSize / (1024 * 1024);
        throw new Error(`文件大小超过限制，最大允许上传 ${sizeInMB}MB。请压缩文件后重试。`);
      }

      setIsUploading(true);
      setProgress(0);
      console.log(`Starting upload of ${file.name} (${file.size} bytes)`);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;
      setProgress(100);

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      console.log('Upload completed successfully');
      return publicUrl;

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "上传失败",
        description: error.message || "文件上传过程中出现错误，请重试",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, progress };
};
