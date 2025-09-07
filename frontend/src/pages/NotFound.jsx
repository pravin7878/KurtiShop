import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-700 px-6">
      {/* Illustration */}
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/008/568/878/small_2x/website-page-not-found-error-404-oops-worried-robot-character-peeking-out-of-outer-space-site-crash-on-technical-work-web-design-template-with-chatbot-mascot-cartoon-online-bot-assistance-failure-vector.jpg" 
        alt="404 Not Found"
        className="w-64 h-64 mb-6"
      />

      {/* Heading */}
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-6 text-center">
        Oops! The page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
