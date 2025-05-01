import { useState } from "react";
import { X } from "lucide-react";
import { useToast } from "@/providers/toastProvider";
import { validateEmail, validateEmptyFields } from "@/utils/validation";

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: {
    name: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }) => void;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({
  isOpen,
  onClose,
  onAddUser,
}) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User");
  const toast = useToast();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {
    const dataToValidate = { name, phoneNumber, email, password };
    const emptyFieldErrors = validateEmptyFields(dataToValidate);
    const errors: { [key: string]: string } = { ...emptyFieldErrors };

    if (!errors.email) {
      const emailError = validateEmail(dataToValidate.email);
      if (emailError) {
        errors.email = emailError;
      }
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "Mật khẩu không khớp!";
    }
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    onAddUser({ name, phoneNumber, email, password, role, confirmPassword });
    onClose();
  };

  if (!isOpen) return null; // Ẩn dialog nếu isOpen = false

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-[600px]">
        {/* Button đóng dialog */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={24} />
        </button>

        <h2 className="text-lg text-center font-semibold">Thêm người dùng</h2>

        {/* Input Name & Phone */}
        <div className="flex gap-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal"
              placeholder="Tên người dùng"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name}</span>
            )}
          </div>

          <div>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full mt-2 p-3 border rounded-lg border-black/10 
            focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
            outline-none placeholder:font-normal"
              placeholder="Số điện thoại"
            />
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>
        </div>

        {/* Input Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none placeholder:font-normal"
          placeholder="Email"
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
        )}

        {/* Input Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none placeholder:font-normal"
          placeholder="Mật khẩu"
        />
        {errors.password && (
          <span className="text-red-500 text-sm">{errors.password}</span>
        )}

        {/* Confirm Password */}
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none placeholder:font-normal"
          placeholder="Nhập lại mật khẩu"
        />
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm">{errors.confirmPassword}</span>
        )}

        {/* Select Role */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full mt-2 p-3 border rounded-lg border-black/10 
          focus:border-[#0053E2] focus:ring-1 focus:ring-[#0053E2] 
          outline-none"
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={onClose}
            className="text-sm bg-[#EAEFFA] text-[#1E4DB7] font-semibold py-2 px-6 rounded-lg"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm bg-[#1E4DB7] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#002E99]"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserDialog;
