'use client';

import React from 'react';
import { useToast } from '@/providers/ToastProvider';
import { ToastType } from '@/components/Toast/Toast';

export default function TestToastPage() {
  const { showToast } = useToast();

  const handleShowToast = (type: ToastType) => {
    console.log(`Attempting to show ${type} toast`);
    showToast(`This is a ${type} message`, type);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Toast Testing Page</h1>
      
      <div className="flex flex-col gap-3 w-full max-w-md">
        <button 
          onClick={() => handleShowToast(ToastType.SUCCESS)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Show Success Toast
        </button>
        
        <button 
          onClick={() => handleShowToast(ToastType.ERROR)}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Show Error Toast
        </button>
        
        <button 
          onClick={() => handleShowToast(ToastType.WARNING)}
          className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
        >
          Show Warning Toast
        </button>
        
        <button 
          onClick={() => handleShowToast(ToastType.INFO)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Show Info Toast
        </button>
      </div>
    </div>
  );
}
