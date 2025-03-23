"use client";
import React, { useState } from "react";

const OtpVerificationPage: React.FC = () => {
  const [email, setEmail] = useState("lethithuyduyen230803@gmail.com");
  const [isResending, setIsResending] = useState(false);

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");
    const visibleStart = name[0];
    const visibleEnd = name.slice(-2);
    const maskedMiddle = "*".repeat(
      name.length - visibleStart.length - visibleEnd.length
    );
    return `${visibleStart}${maskedMiddle}${visibleEnd}@${domain}`;
  };

  const handleResendOtp = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
    }, 5000); // Simulate a delay for resending OTP
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Xác nhận mã OTP</h2>
        <p className="text-gray-600 text-center mb-4">
          Vui lòng nhập mã OTP đã được gửi đến{" "}
          <span className="tracking-widest">{maskEmail(email)}</span>.
        </p>

        <form className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="otp" className="text-sm font-medium">
              Mã OTP
            </label>
            <input
              id="otp"
              type="text"
              className="w-full h-[55px] rounded-3xl px-4 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
              placeholder="Nhập mã OTP"
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-500 hover:underline focus:outline-none"
              disabled={isResending}
            >
              {isResending ? "Đang gửi lại..." : "Gửi lại mã OTP"}
            </button>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full text-base font-bold text-white bg-blue-700 rounded-3xl h-[55px] hover:bg-blue-700 transition-colors"
            >
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
