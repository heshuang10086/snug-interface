
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = {
  video: 200 * 1024 * 1024, // 200MB for videos
  image: 5 * 1024 * 1024,  // 5MB for images
  document: 10 * 1024 * 1024 // 10MB for documents
};

const CHUNK_SIZE = 500 * 1024; // 500KB chunks
const MAX_RETRIES = 3;
const CONCURRENT_CHUNKS = 3;

export const useFileUpload = (bucketName: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const uploadChunkWithRetry = async (
    bucket: string,
    filePath: string,
    chunk: Blob,
    retryCount = 0
  ): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, chunk, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error(`Chunk upload error:`, error);
        throw error;
      }
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying chunk upload, attempt ${retryCount + 1}`);
        await delay(1000 * Math.pow(2, retryCount));
        return uploadChunkWithRetry(bucket, filePath, chunk, retryCount + 1);
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
      console.log(`Starting upload of ${file.name} (${file.size} bytes)`);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = fileName;

      // For small files or non-video files, upload directly
      if (file.size <= CHUNK_SIZE || !bucketName.includes('video')) {
        console.log('Uploading file directly');
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;
        setProgress(100);
      } else {
        // For large video files, upload in one go but with progress monitoring
        console.log('Uploading large video file with progress monitoring');
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
            onUploadProgress: (progress) => {
              const percentage = (progress.loaded / progress.total) * 100;
              setProgress(Math.round(percentage));
            }
          });

        if (uploadError) throw uploadError;
      }

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
