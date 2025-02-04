import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import  pagenotfound  from "../assets/404page.jpg"

const NotFoundScreen = () => {
  return (
    <main className="py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          {/* Page Not Found Image */}
          <div className="empty-cart-img">
            <img
              src={pagenotfound} // Replace with actual image path
              alt="Page Not Found"
              className="object-cover"
            />
          </div>
          {/* Page Not Found Message */}
          <div className="w-full max-w-md mt-4 p-6 rounded-lg bg-gray-100 flex flex-col items-center gap-4">
            <p className="text-4xl font-semibold text-gray-800">
              Oops! Page not found.
            </p>
            <p className="text-gray-600 text-center">
              The page you are looking for might have been removed or is
              temporarily unavailable.
            </p>
            <Link
              to="/"
              className="btn-continue"
            >
               Back to HomePage
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFoundScreen;
