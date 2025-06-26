
import React from "react";
import { CheckCircle } from "lucide-react";

const Toast = ({ mensaje, visible }) => {
  return (
    visible && (
      <div className="flex items-center space-x-2 bg-blue-100 text-gray-800 border border-blue-300 p-3 rounded shadow-md mt-4 w-fit mx-auto transition-all duration-300">
        <CheckCircle className="text-green-600" />
        <span>{mensaje}</span>
      </div>
    )
  );
};

export default Toast;
