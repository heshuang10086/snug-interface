
export const CHUNK_SIZE = 30 * 1024 * 1024; // 30MB in bytes

export const createVideoChunks = (file: File): Blob[] => {
  const chunks: Blob[] = [];
  let start = 0;
  
  while (start < file.size) {
    const end = Math.min(start + CHUNK_SIZE, file.size);
    chunks.push(file.slice(start, end));
    start = end;
  }
  
  return chunks;
};
