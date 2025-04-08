
export const selectAuth = (state: any) => state.auth;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: any) => state.auth.loading;
export const selectAuthError = (state: any) => state.auth.error;
export const selectUser = (state: any) => state.auth.user;