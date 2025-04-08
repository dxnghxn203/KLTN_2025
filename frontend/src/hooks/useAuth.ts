import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { googleLoginStart, googleLoginSuccess, loginStart, logoutStart, selectAuth, selectUser } from '@/store';
import { getToken } from '@/utils/cookie';
import { get } from 'http';

export function useAuth() {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const { loading, error } = useSelector(selectAuth);
    const user= useSelector(selectUser);
    
    const isAuthenticated = useMemo(() => {
        const token = getToken();
        return !!token ;  
    }
    , [getToken]);

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
            onSucess: onSucess,
            onFailed: onFailed,
        }));
    };

    const logout = () => {
        dispatch(logoutStart());
    };

    return {
        user: user || session?.user || null,
        isAuthenticated: isAuthenticated || !!session?.user,
        isLoading: loading,
        error,
        signInWithGoogle,
        login,
        logout,
    };
}
