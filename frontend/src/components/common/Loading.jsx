import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex items-center justify-center h-full">
        <div className="loader w-[45px] aspect-square"></div>
      </div>
    </div>
  );
};

export default Loading;
