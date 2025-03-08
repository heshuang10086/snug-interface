import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import AdminDialog from "@/components/AdminDialog";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CourseCard from "@/components/CourseCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("全部");
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleConfirmPassword = (password: string) => {
    if (password === "ahu@stu123") {
      toast({
        title: "验证成功",
        description: "正在跳转到课程管理页面...",
      });
      setShowAdminDialog(false);
      // Add navigation to the course creation page
      navigate("/course/create");
    } else {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "密码错误，请重试",
      });
    }
  };

  const filteredCourses = courses?.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === "全部" || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const levels = ["全部", "入门", "中级", "进阶", "高级"];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center pt-20 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-block">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium bg-blue-50 text-blue-700 rounded-full">
                  骏杰人力 · AIGC培训
                </span>
              </div>
              
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl pb-4">
                掌握<span className="text-blue-600">AIGC</span>技能,
                <br />
                引领数字化未来
              </h1>
              
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                专业的AIGC培训课程，帮助您快速掌握人工智能生成内容的核心技能，提升工作效率
              </p>
              
              <div className="flex justify-center gap-4">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                  浏览课程
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2"
                  onClick={() => setShowAdminDialog(true)}
                >
                  添加课程
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Course Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-6 mb-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">课程中心</h2>
                <Button onClick={() => setShowAdminDialog(true)} variant="outline">
                  添加课程
                </Button>
              </div>
              
              {/* Search and filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    className="pl-10"
                    placeholder="搜索课程..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {levels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedLevel === level ? "default" : "outline"}
                      onClick={() => setSelectedLevel(level)}
                      size="sm"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Course grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse">
                    <div className="aspect-video bg-gray-200 rounded-lg" />
                    <div className="h-4 bg-gray-200 rounded mt-4 w-3/4" />
                    <div className="h-4 bg-gray-200 rounded mt-2 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredCourses?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">没有找到相关课程</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses?.map((course) => (
                  <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    description={course.description}
                    duration={course.duration}
                    level={course.level}
                    thumbnailUrl={course.thumbnail_url}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <AdminDialog
          open={showAdminDialog}
          onOpenChange={setShowAdminDialog}
          onConfirm={handleConfirmPassword}
        />
      </main>

      <AdminDialog
        open={showAdminDialog}
        onOpenChange={setShowAdminDialog}
        onConfirm={handleConfirmPassword}
      />
    </div>
  );
};

export default Index;
