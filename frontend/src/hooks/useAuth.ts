import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';


import { useEffect } from 'react';
import { googleLoginStart, googleLoginSuccess, loginStart, logoutStart, selectAuth } from '@/store';

export function useAuth() {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const { isAuthenticated, loading, error , user} = useSelector(selectAuth);
    
    // Sync NextAuth session with Redux whenever session changes
    useEffect(() => {
        if (session?.user && !isAuthenticated) {
            dispatch(googleLoginSuccess(session.user));
        }
    }, [session, dispatch, isAuthenticated]);
    
    const signInWithGoogle = async () => {
        dispatch(googleLoginStart());
    };
    
    const login = (credentials: any) => {
        dispatch(loginStart(credentials));
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
