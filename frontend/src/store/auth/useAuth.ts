import { useSelector, useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';
import {
    googleLoginStart,
    loginStart,
    logoutStart,
    googleLoginSuccess
} from './authSlice';
import { selectAuth } from './authSelector';
import { useEffect } from 'react';

export function useAuth() {
    const dispatch = useDispatch();
    const { data: session } = useSession();
    const { user, isAuthenticated, loading, error } = useSelector(selectAuth);
    
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
        // If we have session data but Redux hasn't updated yet, use session data
        user: user || session?.user || null,
        isAuthenticated: isAuthenticated || !!session?.user,
        isLoading: loading,
        error,
        signInWithGoogle,
        login,
        logout,
    };
}
