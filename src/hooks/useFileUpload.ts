
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = {
  video: 200 * 1024 * 1024, // 200MB for videos
  image: 5 * 1024 * 1024,  // 5MB for images
  document: 10 * 1024 * 1024 // 10MB for documents
};

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

export const useFileUpload = (bucketName: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    try {
      // Check file size based on bucket type
      const maxSize = bucketName.includes('video') 
        ? MAX_FILE_SIZE.video 
        : bucketName.includes('image') 
          ? MAX_FILE_SIZE.image 
          : MAX_FILE_SIZE.document;

      if (file.size > maxSize) {
        const sizeInMB = maxSize / (1024 * 1024);
        throw new Error(`文件大小超过限制 (${sizeInMB}MB)`);
      }

      setIsUploading(true);
      setProgress(0);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // For small files, upload directly
      if (file.size <= CHUNK_SIZE) {
        const { error: uploadError, data } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;
      } else {
        // For large files, upload in chunks
        const chunks = Math.ceil(file.size / CHUNK_SIZE);
        const uploadPromises = [];

        for (let i = 0; i < chunks; i++) {
          const start = i * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);
          const chunkPath = `${filePath}.part${i}`;

          uploadPromises.push(
            supabase.storage
              .from(bucketName)
              .upload(chunkPath, chunk, {
                cacheControl: '3600',
                upsert: false,
              })
          );
        }

        const results = await Promise.all(uploadPromises.map(p => p.catch(e => e)));
        const errors = results.filter(result => result instanceof Error);

        if (errors.length > 0) {
          throw new Error('分块上传过程中出现错误，请重试');
        }

        setProgress(100);
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

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
      setProgress(0);
    }
  };

  return { uploadFile, isUploading, progress };
};

