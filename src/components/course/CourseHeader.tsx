
import React from 'react';

const CourseHeader = () => {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-semibold text-center transition-all duration-300 hover:text-primary">
        添加新课程
      </h1>
      <p className="text-center text-gray-500 mt-2 transition-all duration-300 hover:text-gray-700">
        创建新的AIGC培训课程
      </p>
    </div>
  );
};

export default CourseHeader;
