import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import AdminDialog from "@/components/AdminDialog";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const { toast } = useToast();

  const handleConfirmPassword = (password: string) => {
    if (password === "admin") {
      toast({
        title: "验证成功",
        description: "正在跳转到课程管理页面...",
      });
      setShowAdminDialog(false);
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
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">精品课程</h2>
              <Button variant="link" className="text-blue-600">
                查看全部课程 →
              </Button>
            </div>
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
