export const validatePassword = (_: any, value: string | any[]) => {
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  
    if (!upperCaseRegex.test(value.toString())) {
      return Promise.reject(new Error("Mật khẩu phải chứa ít nhất một chữ cái viết hoa."));
    }
    if (!lowerCaseRegex.test(value.toString())) {
      return Promise.reject(new Error("Mật khẩu phải chứa ít nhất một chữ cái thường."));
    }
    if (!digitRegex.test(value.toString())) {
      return Promise.reject(new Error("Mật khẩu phải chứa ít nhất một chữ số."));
    }
    if (!specialCharRegex.test(value.toString())) {
      return Promise.reject(new Error("Mật khẩu phải chứa ít nhất một ký tự đặc biệt."));
    }
    if (value.length < 8) {
      return Promise.reject(new Error("Mật khẩu phải có ít nhất 8 ký tự."));
    }
    return Promise.resolve();
  };
  