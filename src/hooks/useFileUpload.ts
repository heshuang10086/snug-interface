
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const MAX_FILE_SIZE = {
  video: 200 * 1024 * 1024, // 200MB for videos
  image: 5 * 1024 * 1024,  // 5MB for images
  document: 10 * 1024 * 1024 // 10MB for documents
};

const CHUNK_SIZE = 500 * 1024; // Reduce chunk size to 500KB for more reliable uploads
const MAX_RETRIES = 3;
const CONCURRENT_CHUNKS = 3; // Limit concurrent uploads

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
        console.error(`Chunk upload error:`, error);
        throw error;
      }
    } catch (error) {
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying chunk upload, attempt ${retryCount + 1}`);
        await delay(1000 * Math.pow(2, retryCount)); // Exponential backoff
        return uploadChunkWithRetry(bucket, chunkPath, chunk, retryCount + 1);
      }
      throw error;
    }
  };

  const uploadChunksInBatches = async (chunks: { path: string; data: Blob }[]) => {
    let uploadedChunks = 0;
    const totalChunks = chunks.length;

    // Process chunks in batches
    for (let i = 0; i < chunks.length; i += CONCURRENT_CHUNKS) {
      const batch = chunks.slice(i, i + CONCURRENT_CHUNKS);
      await Promise.all(
        batch.map(async ({ path, data }) => {
          await uploadChunkWithRetry(bucketName, path, data);
          uploadedChunks++;
          setProgress(Math.round((uploadedChunks / totalChunks) * 100));
        })
      );
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

      if (file.size <= CHUNK_SIZE) {
        console.log('Uploading small file directly');
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;
        setProgress(100);
      } else {
        console.log(`Splitting file into chunks of ${CHUNK_SIZE} bytes`);
        const chunks = Math.ceil(file.size / CHUNK_SIZE);
        const chunkObjects = Array.from({ length: chunks }).map((_, index) => {
          const start = index * CHUNK_SIZE;
          const end = Math.min(start + CHUNK_SIZE, file.size);
          return {
            path: `${filePath}_part${index}`,
            data: file.slice(start, end)
          };
        });

        await uploadChunksInBatches(chunkObjects);

        // Create final file from first chunk
        console.log('Creating final file');
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
