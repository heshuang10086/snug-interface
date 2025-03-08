
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CourseMetadataFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  duration: string;
  setDuration: (duration: string) => void;
  level: string;
  setLevel: (level: string) => void;
}

const CourseMetadataForm = ({
  title,
  setTitle,
  description,
  setDescription,
  duration,
  setDuration,
  level,
  setLevel,
}: CourseMetadataFormProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center">
          课程标题 <span className="text-red-500">*</span>
        </label>
        <Input 
          placeholder="输入课程标题" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium flex items-center">
          课程描述 <span className="text-red-500">*</span>
        </label>
        <Textarea 
          placeholder="输入课程详细描述" 
          className="min-h-[100px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">课程时长</label>
          <Input 
            placeholder="例如: 2小时30分钟" 
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">难度级别</label>
          <Select value={level} onValueChange={setLevel}>
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
    </div>
  );
};

export default CourseMetadataForm;
