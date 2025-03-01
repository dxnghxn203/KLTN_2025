import { AuthProvider } from "./AuthProvider";
import { ReduxProviders } from "./ReduxProvider";
import { ToastProvider } from "./ToastProvider";

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