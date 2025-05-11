

export const insertUserSelector = (state: any) => state.user.responseInsertUser;
export const selectUserLoading = (state: any) => state.user.loading;
export const selectUserError = (state: any) => state.user.error;
export const selectAllUserAdmin = (state: any) => state.user.allUserAdmin;
export const selectUser = (state: any) => state.user;
export const selectAllPharmacist = (state: any) => state.user.allPharmacist;
export const selectAllAdmin = (state: any) => state.user.allAdmin;
    
