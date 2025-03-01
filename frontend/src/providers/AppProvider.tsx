import { AuthProvider } from "./AuthProvider";
import { ReduxProviders } from "./ReduxProvider";

export const AppProviders = (props: React.PropsWithChildren) => {
    return (
        <AuthProvider>
            <ReduxProviders>
                {props.children}
            </ReduxProviders>
        </AuthProvider>
    );
};