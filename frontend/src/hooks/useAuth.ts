import {useSelector, useDispatch} from 'react-redux';
import {useSession} from 'next-auth/react';
import {useEffect, useMemo, useState} from 'react';
import {
    googleLoginStart,
    googleLoginSuccess,
    loginAdminStart,
    loginPharmacistStart,
    loginStart,
    logoutStart,
    selectAdminAuth,
    selectAuth,
    selectPharmacistAuth,
    selectUserAuth
} from '@/store';
import {getToken} from "@/utils/cookie";

export function useAuth() {
    const dispatch = useDispatch();
    const {data: session} = useSession();
    const {loading, error, isAuthenticated} = useSelector(selectAuth);
    const user = useSelector(selectUserAuth);
    const admin = useSelector(selectAdminAuth);
    const pharmacist = useSelector(selectPharmacistAuth);

    useEffect(() => {
        if (session?.user && !isAuthenticated) {
            dispatch(googleLoginSuccess(session.user));
        }
    }, [session, dispatch, isAuthenticated]);

    const signInWithGoogle = async () => {
        dispatch(googleLoginStart());
    };

    const login = (
        credentials: any,
        onSucess: () => void,
        onFailed: (message: any) => void,
    ) => {
        dispatch(loginStart({
            ...credentials,
            onSuccess:
            onSucess,
            onFailed:
            onFailed,
        }));
    };

    const logout = (
        role_type: string,
        onSuccess: (message: any) => void,
        onFailure: (message: any) => void,
    ) => {
        console.log("logout hook");
        dispatch(logoutStart(
            {
                role_type: role_type,
                onSuccess: onSuccess,
                onFailure: onFailure,
            }
        ));
        // onSuccess("Đăng xuất thành công!");
        // onFailure("Đăng xuất thất bại!");
    };

    const loginAdmin = (
        credentials: any,
        onSuccess: (message: any) => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(loginAdminStart({
            ...credentials,
            onSuccess: onSuccess,
            onFailure: onFailure,
        }));

    };

    const loginPharmacist = (
        credentials: any,
        onSuccess: (message: any) => void,
        onFailure: (message: any) => void,
    ) => {
        dispatch(loginPharmacistStart({
            ...credentials,
            onSuccess: onSuccess,
            onFailure: onFailure,
        }));
    }

    return {
        user: user || session?.user || null,
        isAuthenticated: isAuthenticated || !!session?.user || getToken(),
        isLoading: loading,
        error,
        signInWithGoogle,
        login,
        logout,
        loginAdmin,
        admin: admin || null,
        loginPharmacist,
        pharmacist: pharmacist || null,
    };
}
