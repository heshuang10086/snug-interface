
import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/c4a1f13a-2915-4373-bc89-b849b049fc81.png" alt="骏杰人力" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold">骏杰人力</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b-2 border-black">
              首页
            </Link>
            <Link to="/courses" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              课程
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
              关于我们
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
