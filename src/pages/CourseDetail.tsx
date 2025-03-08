import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Video, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
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
          <div className="flex items-center gap-4 mb-6">
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

          <div className="space-y-8">
            {/* Video Section */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Video className="h-5 w-5" />
                <h2 className="text-xl font-semibold">课程视频</h2>
              </div>
              <div className="aspect-video">
                <video
                  src={course.video_url}
                  controls
                  className="w-full h-full rounded-lg"
                />
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
