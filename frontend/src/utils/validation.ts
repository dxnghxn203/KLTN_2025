export const validatePassword = (value: string): Promise<void> => {
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  
    if (!upperCaseRegex.test(value)) {
      return Promise.reject(new Error("Mật khẩu phải chứa ít nhất một chữ cái viết hoa."));
    }
    if (!lowerCaseRegex.test(value)) {
      return Promise.reject(new Error("Mật khẩu phải chứa ít nhất một chữ cái thường."));
    }
    if (!digitRegex.test(value)) {
      return Promise.reject(new Error("Mật khẩu phải chứa ít nhất một chữ số."));
    }
    if (!specialCharRegex.test(value)) {
      return Promise.reject(new Error("Mật khẩu phải chứa ít nhất một ký tự đặc biệt."));
    }
    if (value.length < 8) {
      return Promise.reject(new Error("Mật khẩu phải có ít nhất 8 ký tự."));
    }
    return Promise.resolve();
  };
  
  export const validateEmail = (value: string): Promise<void> => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!emailPattern.test(value)) {
      return Promise.reject(new Error("Email không đúng định dạng!"));
    }
  
    return Promise.resolve();
  };
  
  export const validateEmptyFields = (fields: { [key: string]: string }): string | null => {
    for (const [key, value] of Object.entries(fields)) {
      if (!value.trim()) {
        return `Trường ${key} không được để trống.`;
      }
    }
    return null;
  };
  