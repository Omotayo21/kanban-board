
import React from "react";

const Loader2 = () => {
  return (
    <div className=" fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce delay-200"></div>
        <div className="w-4 h-4 bg-purple-600 rounded-full animate-bounce delay-500"></div>
      </div>
    </div>
  );
};

export default Loader2;