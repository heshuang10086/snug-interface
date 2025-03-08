
import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  duration?: string;
  level: string;
  thumbnailUrl?: string;
}

const CourseCard = ({ title, description, duration, level, thumbnailUrl, id }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={thumbnailUrl || "/placeholder.svg"} 
          alt={title}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
          {level}
        </div>
      </div>
      <CardHeader className="space-y-1">
        <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
        {duration && (
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {duration} 分钟
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">{description}</p>
        <Link to={`/course/${id}`}>
          <Button className="w-full">开始学习</Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
