
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useAliyunOssUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadLargeVideo = async (file: File) => {
    try {
      setIsUploading(true);
      setProgress(0);

      // Get the upload URL and form data from our edge function
      const { data, error } = await supabase.functions.invoke('aliyun-oss-upload', {
        body: {
          filename: file.name,
          contentType: file.type,
          size: file.size
        }
      });

      if (error) throw error;
      const { uploadUrl, formData, fileUrl } = data;

      // Create form data for upload
      const uploadFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        uploadFormData.append(key, value as string);
      });
      uploadFormData.append('file', file);

      // Upload to Aliyun OSS
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: uploadFormData
      });

      if (!uploadResponse.ok) {
        throw new Error('上传到阿里云OSS失败');
      }

      setProgress(100);
      console.log('Upload completed successfully to:', fileUrl);
      return fileUrl;

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

  return { uploadLargeVideo, isUploading, progress };
};
