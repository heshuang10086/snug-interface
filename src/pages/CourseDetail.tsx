
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Video, FileText, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";

interface VideoChunk {
  id: string;
  course_id: string;
  chunk_index: number;
  chunk_url: string;
  created_at: string;
}

interface CourseWithChunks {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string | null;
  ppt_url: string | null;
  duration: string | null;
  level: string;
  created_at: string;
  updated_at: string;
  featured: boolean | null;
  video_chunks_count: number | null;
  video_chunks?: VideoChunk[];
}

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      console.log("Fetching course details for id:", id);
      const [courseResult, chunksResult] = await Promise.all([
        supabase
          .from("courses")
          .select("*")
          .eq("id", id)
          .single(),
        supabase
          .from("video_chunks")
          .select("*")
          .eq("course_id", id)
          .order("chunk_index")
      ]);

      if (courseResult.error) throw courseResult.error;
      
      const courseData = courseResult.data as CourseWithChunks;
      if (courseData.video_chunks_count && courseData.video_chunks_count > 1) {
        courseData.video_chunks = chunksResult.data;
      }
      
      console.log("Fetched course:", courseData);
      return courseData;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!id) {
        throw new Error("课程ID不存在");
      }

      // 先验证课程是否存在
      const { data: course, error: fetchError } = await supabase
        .from('courses')
        .select('id')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error("Error fetching course:", fetchError);
        throw new Error("验证课程时出错");
      }

      if (!course) {
        throw new Error("课程未找到");
      }

      // 执行删除操作
      const { error: deleteError } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error("Delete error details:", deleteError);
        throw new Error(`删除失败: ${deleteError.message}`);
      }

      return true;
    },
    onSuccess: () => {
      toast.success("课程已成功删除");
      queryClient.invalidateQueries({ queryKey: ["all-courses"] });
      navigate("/courses");
    },
    onError: (error: Error) => {
      console.error("Delete mutation error:", error);
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    if (window.confirm("确定要删除这个课程吗？")) {
      console.log("Attempting to delete course with ID:", id);
      deleteMutation.mutate();
    }
  };

  // Video error handling
  const handleVideoError = (error: any) => {
    console.error('Video playback error:', error);
    setError('视频加载失败，请刷新页面重试');
    setIsLoading(false);
  };

  // Video loaded handling
  const handleVideoLoaded = () => {
    setIsLoading(false);
    setError(null);
  };

  if (isCourseLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6" />
            <div className="h-96 bg-gray-200 rounded mb-8" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
          <p>课程未找到</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              删除课程
            </Button>
          </div>

          <div className="space-y-8">
            {/* Video Section */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="h-5 w-5" />
                <h2 className="text-xl font-semibold">课程视频</h2>
              </div>
              <div className="aspect-video relative">
                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}
                {isLoading && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <p className="text-gray-500">视频加载中...</p>
                  </div>
                )}
                {course.video_chunks_count && course.video_chunks_count > 1 && course.video_chunks ? (
                  <video 
                    ref={videoRef}
                    controls 
                    className="w-full h-full rounded-lg"
                    onError={handleVideoError}
                    onLoadedData={handleVideoLoaded}
                    preload="metadata"
                    controlsList="nodownload"
                    crossOrigin="anonymous"
                  >
                    {course.video_chunks.map((chunk) => (
                      <source 
                        key={chunk.id}
                        src={chunk.chunk_url}
                        type="video/mp4"
                      />
                    ))}
                    <p>您的浏览器不支持HTML5视频播放</p>
                  </video>
                ) : (
                  <video
                    ref={videoRef}
                    controls
                    src={course.video_url}
                    onError={handleVideoError}
                    onLoadedData={handleVideoLoaded}
                    preload="metadata"
                    controlsList="nodownload"
                    crossOrigin="anonymous"
                    className="w-full h-full rounded-lg"
                  >
                    <p>您的浏览器不支持HTML5视频播放</p>
                  </video>
                )}
              </div>
            </Card>

            {/* PPT Section */}
            {course.ppt_url && (
              <Card className="p-6">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5" />
                      <h2 className="text-xl font-semibold">课程讲义</h2>
                    </div>
                    <p className="text-gray-500">点击右侧按钮下载课程讲义</p>
                  </div>
                  <Button onClick={() => window.open(course.ppt_url, '_blank')}>
                    <Download className="mr-2 h-4 w-4" />
                    下载讲义
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;

