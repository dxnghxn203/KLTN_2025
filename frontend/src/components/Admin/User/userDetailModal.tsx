import React from "react";
import { X } from "lucide-react";

interface User {
  _id: string;
  phone_number: string;
  user_name: string;
  email: string;
  gender: string;
  auth_provider: string;
  birthday: string;
  role_id: string;
  active: boolean;
  verified_email_at: string;
  created_at: string;
  updated_at: string;
}

interface UserDetailModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Format dates
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Không có dữ liệu";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-medium text-gray-900">Chi tiết người dùng</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin cơ bản */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 border-b pb-2">Thông tin cá nhân</h4>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">ID người dùng</p>
                  <p className="text-sm font-medium break-all">{user._id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Họ và tên</p>
                  <p className="text-sm font-medium">{user.user_name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
                  <p className="text-sm font-medium">{user.gender}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p className="text-sm font-medium">{formatDate(user.birthday)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="text-sm font-medium">{user.phone_number}</p>
                </div>
              </div>
            </div>
            
            {/* Thông tin tài khoản */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 border-b pb-2">Thông tin tài khoản</h4>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Phương thức đăng ký</p>
                  <p className="text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.auth_provider === 'email' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {user.auth_provider === 'email' ? 'Email' : 'Google'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Vai trò</p>
                  <p className="text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role_id === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role_id === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p className="text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Đã kích hoạt' : 'Chưa kích hoạt'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Xác thực email</p>
                  <p className="text-sm font-medium">{formatDate(user.verified_email_at)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Thời gian */}
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium text-gray-900 mb-3">Thời gian</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Ngày tạo tài khoản</p>
                <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                <p className="text-sm font-medium">{formatDate(user.updated_at)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
