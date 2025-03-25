// Kiểm tra mật khẩu
export const validatePassword = (value: string): string | null => {
    if (!/[A-Z]/.test(value)) {
      return "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.";
    }
    if (!/[a-z]/.test(value)) {
      return "Mật khẩu phải chứa ít nhất một chữ cái thường.";
    }
    if (!/[0-9]/.test(value)) {
      return "Mật khẩu phải chứa ít nhất một chữ số.";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)) {
      return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";
    }
    if (value.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự.";
    }
    return null;
  };
  
  // Kiểm tra email
  export const validateEmail = (value: string): string | null => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(value) ? null : "Email không đúng định dạng!";
  };
  
  // Kiểm tra trường trống
  export const validateEmptyFields = (fields: { [key: string]: string }): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    for (const [key, value] of Object.entries(fields)) {
      if (!value.trim()) {
        errors[key] = `Trường ${key} không được để trống.`;
      }
    }
    return errors;
  };
  