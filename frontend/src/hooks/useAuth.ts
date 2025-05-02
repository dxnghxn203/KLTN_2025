import {useSelector, useDispatch} from 'react-redux';
import {useSession} from 'next-auth/react';
import {useEffect, useMemo, useState} from 'react';
import {
    googleLoginStart,
    googleLoginSuccess,
    loginAdminStart,
    loginStart,
    logoutStart,
    selectAdminAuth,
    selectAuth,
    selectUserAuth
} from '@/store';


// import {getToken} from '@/utils/cookie';
///llll
//

export function useAuth() {
    const dispatch = useDispatch();
    const {data: session} = useSession();
    const {loading, error, isAuthenticated} = useSelector(selectAuth);
    const user = useSelector(selectUserAuth);
    const admin = useSelector(selectAdminAuth);

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

    const logout = () => {
        dispatch(logoutStart());
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


    return {
        user: user || session?.user || null,
        isAuthenticated: isAuthenticated || !!session?.user,
        isLoading: loading,
        error,
        signInWithGoogle,
        login,
        logout,
        loginAdmin,
        admin: admin || null,
    };
}
