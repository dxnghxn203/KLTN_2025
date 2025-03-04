import axiosClient from "@/utils/configs/axiosClient";
import { AuthResponse, GoogleSignInData, LoginData } from "@/types/auth";

export const signInWithGoogle = async (data: GoogleSignInData): Promise<AuthResponse> => {
    try {
        // const response = await axiosClient.post('/v1/authen/google-auth', data);
        // return {
        //     success: true,
        //     message: response.data || 'Đăng nhập bằng Google thành công',
        // };

        return {
            success: true,
            message: 'Đăng nhập bằng Google thành công',
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Đăng nhập bằng Google thất bại'
        };
    }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    try {
        // const response = await axiosClient.post('/v1/authen/login', data);
        // return {
        //     success: true,
        //     user: response.data.user,
        //     token: response.data.token
        // };

        return {
            success: true,
            user: null,
            token: "null"
        };

    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Đăng nhập thất bại'
        };
    }
};

// Logout
export const logout = async (token: string): Promise<boolean> => {
    try {
        // await axiosClient.post('/v1/authen/logout', {}, {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // });
        return true;
    } catch (error) {
        console.error('Logout error:', error);
        return false;
    }
};

// Verify token
export const verifyToken = async (token: string) => {
    try {
        const response = await axiosClient.post("/auth/verify-token", {
            token: token,
        });
        return { isValid: true, userData: response.data.user };
    } catch (error) {
        console.error("Error verifying token:", error);
        return { isValid: false };
    }
};

// Get user profile
export const getUserProfile = async (token: string) => {
    try {
        const response = await axiosClient.get("/user/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};
