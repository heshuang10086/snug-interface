
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createVideoChunks, CHUNK_SIZE } from "@/utils/videoChunking";

const MAX_FILE_SIZE = {
  image: 5 * 1024 * 1024,  // 5MB for images
  document: 10 * 1024 * 1024 // 10MB for documents
};

export const useFileUpload = (bucketName: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);
      setProgress(0);
      console.log(`Starting upload of ${file.name} (${file.size} bytes)`);
      
      // Handle video uploads with chunking
      if (bucketName.includes('video')) {
        const chunks = createVideoChunks(file);
        const totalChunks = chunks.length;
        const uploadedChunks: string[] = [];
        
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const chunkFileName = `${Math.random()}_chunk${i}`;
          
          const { error: uploadError, data } = await supabase.storage
            .from(bucketName)
            .upload(chunkFileName, chunk, {
              cacheControl: '3600',
              upsert: true
            });

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(chunkFileName);
            
          uploadedChunks.push(publicUrl);
          setProgress(Math.round(((i + 1) / totalChunks) * 100));
        }
        
        return {
          urls: uploadedChunks,
          chunksCount: totalChunks
        };
      }

      // Handle regular file uploads (images, documents)
      const maxSize = bucketName.includes('image') 
        ? MAX_FILE_SIZE.image 
        : MAX_FILE_SIZE.document;

      if (file.size > maxSize) {
        const sizeInMB = maxSize / (1024 * 1024);
        throw new Error(`文件大小超过限制，最大允许上传 ${sizeInMB}MB。请压缩文件后重试。`);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      setProgress(100);
      console.log('Upload completed successfully');
      return { urls: [publicUrl], chunksCount: 1 };

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
