
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["all-courses"], // Changed from "courses" to "all-courses" to match deletion invalidation
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredCourses = courses?.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">课程中心</h1>
          </div>
          
          <div className="relative w-full max-w-md mb-8">
            <Input
              type="text"
              placeholder="搜索课程..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-gray-200 rounded-lg" />
                  <div className="h-4 bg-gray-200 rounded mt-4 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
                </div>
              ))
            ) : (
              filteredCourses?.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  duration={course.duration}
                  level={course.level}
                  thumbnailUrl={course.thumbnail_url}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Courses;
