import { AuthProvider } from "./authProvider";
import { ReduxProviders } from "./reduxProvider";
import { ToastProvider } from "./toastProvider";

export const AppProviders = (props: React.PropsWithChildren) => {
    return (
        <ToastProvider>
            <AuthProvider>
                <ReduxProviders>
                    {props.children}
                </ReduxProviders>
            </AuthProvider>
        </ToastProvider>
    );
};