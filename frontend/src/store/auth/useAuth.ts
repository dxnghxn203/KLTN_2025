import { useSelector, useDispatch } from 'react-redux';
import {
    googleLoginStart,
    loginStart,
    logoutStart,
    checkAuthStart,
} from './authSlice';
import { selectAuth } from './authSelector';

interface UseAuthReturn {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any | null;
    signInWithGoogle: () => void;
    login: (credentials: any) => void;
    logout: () => void;
    error: any;
}

export function useAuth(): UseAuthReturn {
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading, error } = useSelector(selectAuth);

    // useEffect(() => {
    //     dispatch(checkAuthStart());
    // }, [dispatch]);

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
        user,
        isAuthenticated,
        isLoading: loading,
        error,
        signInWithGoogle,
        login,
        logout,
    };
}
