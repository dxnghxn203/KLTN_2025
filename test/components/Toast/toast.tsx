import React, { useEffect } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEFAULT = 'default'
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
    switch(type) {
      case ToastType.SUCCESS:
        return {
          icon: <FiCheckCircle size={20} />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          borderColor: 'border-green-500',
          iconColor: 'text-green-500'
        };
      case ToastType.ERROR:
        return {
          icon: <FiXCircle size={20} />,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          borderColor: 'border-red-500',
          iconColor: 'text-red-500'
        };
      case ToastType.WARNING:
        return {
          icon: <FiAlertTriangle size={20} />,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-500',
          iconColor: 'text-yellow-500'
        };
      case ToastType.INFO:
        return {
          icon: <FiInfo size={20} />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-500',
          iconColor: 'text-blue-500'
        };
      default:
        return {
          icon: <FiInfo size={20} />,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-500',
          iconColor: 'text-gray-500'
        };
    }
  };

  const config = getToastConfig();

  return (
    <div 
      className={`flex items-center w-80 p-4 mb-4 rounded-lg shadow-xl ${config.bgColor} border-l-4 ${config.borderColor}`}
      style={{
        animation: 'fadeIn 0.3s ease-out forwards',
        opacity: 0  
      }}
      role="alert"
    >
      <div className={`inline-flex items-center justify-center flex-shrink-0 ${config.iconColor}`}>
        {config.icon}
      </div>
      <div className={`ml-3 text-sm font-medium ${config.textColor} flex-grow`}>
        {message}
      </div>
      {onClose && (
        <button 
          type="button" 
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300 inline-flex items-center justify-center h-8 w-8 ${config.textColor}`}
          onClick={onClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <FiX size={18} />
        </button>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Toast;