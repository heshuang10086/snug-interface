
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useFileUpload = (bucketName: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setProgress(0);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          onUploadProgress: (event) => {
            const progress = (event.loaded / event.total) * 100;
            setProgress(Math.round(progress));
          },
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "上传失败",
        description: "文件上传过程中出现错误，请重试",
      });
      return null;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return { uploadFile, isUploading, progress };
};
