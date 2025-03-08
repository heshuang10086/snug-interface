
import React from 'react';
import Navigation from "@/components/Navigation";
import CourseHeader from "@/components/course/CourseHeader";
import CourseForm from "@/components/course/CourseForm";

const CourseCreate = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <CourseHeader />
          <CourseForm />
        </div>
      </main>
    </div>
  );
};

export default CourseCreate;
