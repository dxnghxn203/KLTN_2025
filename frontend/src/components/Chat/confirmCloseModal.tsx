import React from "react";

interface ConfirmCloseModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmCloseModal: React.FC<ConfirmCloseModalProps> = ({
                                                                        isOpen,
                                                                        onConfirm,
                                                                        onCancel,
                                                                    }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                <h3 className="text-lg font-semibold mb-4">Xác nhận đóng chat</h3>
                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn kết thúc cuộc trò chuyện này? Tin nhắn sẽ không được lưu lại.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md"
                    >
                        Đóng chat
                    </button>
                </div>
            </div>
        </div>
    );
};