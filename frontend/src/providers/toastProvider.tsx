"use client";

import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
import Toast, { ToastType } from "@/components/Toast/toast";

interface ToastContextType {
  showToast: (message: string, type: ToastType | string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastItem {
  id: string;
  message: string;
  type: ToastType | string;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType | string = ToastType.DEFAULT) => {
      const id = `toast-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);

      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        className="fixed left-0 right-0 top-4 flex justify-center items-start z-[99999]"
        style={{ pointerEvents: "none" }}
      >
        <div className="flex flex-col items-center space-y-2 max-w-md w-full">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              style={{ pointerEvents: "auto", width: "100%" }}
            >
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => removeToast(toast.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};
