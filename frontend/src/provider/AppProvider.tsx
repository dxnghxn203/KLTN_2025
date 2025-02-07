import { ReduxProviders } from "./ReduxProvider";

export const AppProviders = (props: React.PropsWithChildren) => {
    return (
        <ReduxProviders>
            {props.children}
        </ReduxProviders>
    );
};