    import { useSelector, useDispatch } from 'react-redux';
    import { useSession } from 'next-auth/react';
    import { useEffect } from 'react';
    import { googleLoginStart, googleLoginSuccess, loginStart, logoutStart, selectAuth } from '@/store';

    export function useAuth() {
        const dispatch = useDispatch();
        const { data: session } = useSession();
        const { isAuthenticated, loading, error , user} = useSelector(selectAuth);
        
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
            onSucess: ()=> void,
            onFailed: (message: any)=> void,
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
