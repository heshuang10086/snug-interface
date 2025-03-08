
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import CourseMetadataForm from './CourseMetadataForm';
import CourseFileUploads from './CourseFileUploads';
import { useCourseSubmit } from '@/hooks/useCourseSubmit';

const CourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("beginner");
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [ppt, setPpt] = useState<File | null>(null);

  const navigate = useNavigate();
  const { submitCourse, isSubmitting } = useCourseSubmit();

  const handleVideoDuration = (duration: string) => {
    setDuration(duration);
  };

  const handleSubmit = () => {
    submitCourse({
      title,
      description,
      duration,
      level,
      video,
      thumbnail,
      ppt
    });
  };

  return (
    <div className="space-y-8 bg-white shadow-sm rounded-lg p-6 transition-all duration-300 hover:shadow-md animate-scale-in">
      <div className="space-y-6">
        <CourseFileUploads
          video={video}
          setVideo={setVideo}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          ppt={ppt}
          setPpt={setPpt}
          onVideoDuration={handleVideoDuration}
        />

        <CourseMetadataForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          duration={duration}
          setDuration={setDuration}
          level={level}
          setLevel={setLevel}
        />

        <div className="pt-6 flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/")}
            className="transition-all duration-300 hover:scale-105"
          >
            取消
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="transition-all duration-300 hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                创建中...
              </>
            ) : (
              '创建课程'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseForm;
