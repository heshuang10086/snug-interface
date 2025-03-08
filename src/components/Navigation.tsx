
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src="/lovable-uploads/7c10db47-662a-4d5c-be90-d7f8bda3be6c.png" alt="骏杰人才" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold">骏杰人才</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${
                location.pathname === "/" 
                  ? "text-gray-900 border-b-2 border-black" 
                  : "text-gray-600"
              } hover:text-blue-600 px-3 py-2 text-sm font-medium`}
            >
              首页
            </Link>
            <Link 
              to="/courses" 
              className={`${
                location.pathname === "/courses" 
                  ? "text-gray-900 border-b-2 border-black" 
                  : "text-gray-600"
              } hover:text-blue-600 px-3 py-2 text-sm font-medium`}
            >
              课程
            </Link>
            <Link 
              to="/about" 
              className={`${
                location.pathname === "/about" 
                  ? "text-gray-900 border-b-2 border-black" 
                  : "text-gray-600"
              } hover:text-blue-600 px-3 py-2 text-sm font-medium`}
            >
              关于我们
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
