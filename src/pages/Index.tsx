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

const Index = () => {
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

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
      navigate("/course/create");
    } else {
      toast({
        variant: "destructive",
        title: "验证失败",
        description: "密码错误，请重试",
      });
    }
  };

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
        <section className="py-16">
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
              courses?.map((course) => (
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
        </section>
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
