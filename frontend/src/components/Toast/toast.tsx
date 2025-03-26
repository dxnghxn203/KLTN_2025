import React, { useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiInfo,
  FiX,
} from "react-icons/fi";

export enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
  DEFAULT = "default",
}

interface ToastProps {
  message: string;
  type: ToastType | string;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    console.log(`Toast rendered: ${message}, type: ${type}`);
  }, [message, type]);

  const getToastConfig = () => {
    switch (type) {
      case ToastType.SUCCESS:
        return {
          icon: <FiCheckCircle size={20} />,
          bgColor: "bg-green-100",
          textColor: "text-green-800",
          borderColor: "border-green-500",
          iconColor: "text-green-500",
        };
      case ToastType.ERROR:
        return {
          icon: <FiXCircle size={20} />,
          bgColor: "bg-red-100",
          textColor: "text-red-800",
          borderColor: "border-red-500",
          iconColor: "text-red-500",
        };
      case ToastType.WARNING:
        return {
          icon: <FiAlertTriangle size={20} />,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-800",
          borderColor: "border-yellow-500",
          iconColor: "text-yellow-500",
        };
      case ToastType.INFO:
        return {
          icon: <FiInfo size={20} />,
          bgColor: "bg-blue-100",
          textColor: "text-blue-800",
          borderColor: "border-blue-500",
          iconColor: "text-blue-500",
        };
      default:
        return {
          icon: <FiInfo size={20} />,
          bgColor: "bg-gray-100",
          textColor: "text-gray-800",
          borderColor: "border-gray-500",
          iconColor: "text-gray-500",
        };
    }
  };

  const config = getToastConfig();

  return (
    <div
      className={`fixed top-5 right-5 px-4 py-2 rounded-xl animate-slide-in ${config.bgColor} border-l-4 ${config.borderColor}`}
      style={{
        animation: "fadeIn 0.3s ease-out forwards",
        opacity: 0,
      }}
      role="alert"
    >
      <div className="flex items-center justify-between space-x-6">
        <div className="flex items-center space-x-2">
          <span className={`block ${config.iconColor}`}>{config.icon}</span>
          <span className={`block font-semibold text-sm ${config.textColor}`}>
            {message}
          </span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
