
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = {
  video: 200 * 1024 * 1024, // 200MB for videos
  image: 5 * 1024 * 1024,  // 5MB for images
  document: 10 * 1024 * 1024 // 10MB for documents
};

const CHUNK_SIZE = 1 * 1024 * 1024; // Reduce chunk size to 1MB for more reliable uploads
const MAX_RETRIES = 3;

export const useFileUpload = (bucketName: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const uploadChunkWithRetry = async (
    bucket: string,
    chunkPath: string,
    chunk: Blob,
    retryCount = 0
  ): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(chunkPath, chunk, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        await delay(1000 * (retryCount + 1)); // Exponential backoff
        return uploadChunkWithRetry(bucket, chunkPath, chunk, retryCount + 1);
      }
      throw error;
    }
  };

  const uploadFile = async (file: File) => {
    try {
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
      const filePath = fileName;

      if (file.size <= CHUNK_SIZE) {
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;
        setProgress(100);
      } else {
        const chunks = Math.ceil(file.size / CHUNK_SIZE);
        let uploadedChunks = 0;

        // Create array of chunk upload promises
        const chunkUploadPromises = Array.from({ length: chunks }).map(async (_, index) => {
          const start = index * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          const chunk = file.slice(start, end);
          const chunkPath = `${filePath}_part${index}`;

          try {
            await uploadChunkWithRetry(bucketName, chunkPath, chunk);
            uploadedChunks++;
            setProgress(Math.round((uploadedChunks / chunks) * 100));
          } catch (error) {
            console.error(`Error uploading chunk ${index}:`, error);
            throw new Error(`第 ${index + 1} 个分片上传失败，请重试`);
          }
        });

        // Upload chunks sequentially to prevent overwhelming the server
        for (const promise of chunkUploadPromises) {
          await promise;
        }

        // If all chunks uploaded successfully, create final file
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file.slice(0, CHUNK_SIZE), {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) throw uploadError;
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
    }
  };

  return { uploadFile, isUploading, progress };
};
