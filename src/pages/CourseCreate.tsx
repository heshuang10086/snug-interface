
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import Navigation from "@/components/Navigation";

const CourseCreate = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-center">添加新课程</h1>
            <p className="text-center text-gray-500 mt-2">创建新的AIGC培训课程</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center">
                课程视频 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">上传课程视频</p>
                  <p className="text-xs text-gray-500 mt-1">支持MP4格式，确保高清品质上传</p>
                </div>
                <Button variant="outline">选择文件</Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center">
                课程封面图片 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">上传课程封面</p>
                  <p className="text-xs text-gray-500 mt-1">推荐尺寸 16:9，支持 JPG、PNG 格式</p>
                </div>
                <Button variant="outline">选择图片</Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center">
                课程PPT <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">上传课程PPT</p>
                  <p className="text-xs text-gray-500 mt-1">支持PPT格式，确保高清品质上传</p>
                </div>
                <Button variant="outline">选择PPT</Button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center">
                课程标题 <span className="text-red-500">*</span>
              </label>
              <Input placeholder="输入课程标题" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center">
                课程描述 <span className="text-red-500">*</span>
              </label>
              <Textarea placeholder="输入课程详细描述" className="min-h-[100px]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">课程时长</label>
                <Input placeholder="例如: 2小时30分钟" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">难度级别</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="入门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">入门</SelectItem>
                    <SelectItem value="intermediate">进阶</SelectItem>
                    <SelectItem value="advanced">高级</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-6 flex justify-end space-x-4">
              <Button variant="outline">取消</Button>
              <Button>创建课程</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseCreate;
