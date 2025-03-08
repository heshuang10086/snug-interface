
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = {
  video: 50 * 1024 * 1024, // 50MB for videos (Supabase limit)
  image: 5 * 1024 * 1024,  // 5MB for images
  document: 10 * 1024 * 1024 // 10MB for documents
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useFileUpload = (bucketName: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      const maxSize = bucketName.includes('video') 
        ? MAX_FILE_SIZE.video 
        : bucketName.includes('image') 
          ? MAX_FILE_SIZE.image 
          : MAX_FILE_SIZE.document;

      if (file.size > maxSize) {
        if (bucketName.includes('video')) {
          toast({
            variant: "destructive",
            title: "文件过大",
            description: "由于Supabase存储限制,视频文件不能超过50MB。建议:\n" +
                        "1. 压缩视频文件\n" +
                        "2. 使用视频托管服务(如AWS S3、Cloudflare Stream)\n" +
                        "3. 将视频上传到视频平台后嵌入链接",
          });
        } else {
          const sizeInMB = maxSize / (1024 * 1024);
          throw new Error(`文件大小超过限制，最大允许上传 ${sizeInMB}MB。请压缩文件后重试。`);
        }
        return null;
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
