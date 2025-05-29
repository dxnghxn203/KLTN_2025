export const ROLE_ACTIONS_ADMIN = [
    'fetchGetAllUserAdminStart',
    'fetchChangePasswordAdminStart',
    'fetchForgotPasswordAdminStart',
    'fetchAllProductAdminStart',
    'fetchGetAllOrderAdminStart',
    'fetchGetAllCategoryForAdminStart',
    'fetchUpdateMainCategoryStart',
    'fetchUpdateSubCategoryStart',
    'fetchUpdateChildCategoryStart',
    'fetchAddCategoryStart',
    'fetchAddChildCategoryStart',
    'fetchAddSubCategoryStart',
    'fetchUpdateImageSubCategoryStart',
    'fetchUpdateImageChildCategoryStart',
    'fetchDeleteChildCategoryStart',
    'fetchDeleteSubCategoryStart',
    'fetchDeleteMainCategoryStart',
    'loginAdminStart',
    'fetchDeleteVoucherStart',
    'fetchAddVoucherStart',
    'fetchAllVoucherStart',
    'fetchUpdateStatusStart',
    'fetchGetAllBrandAdminStart',
    'fetchAddBrandAdminStart',
    'fetchDeleteBrandAdminStart',
    'fetchUpdateBrandAdminStart',
    'fetchUpdateLogoBrandAdminStart',

    'fetchGetAllArticleAdminStart',
    'fetchAddArticleAdminStart',
    'fetchDeleteArticleAdminStart',
    'fetchUpdateArticleAdminStart',
    'fetchUpdateLogoArticleAdminStart',

    'fetchGetOverviewStatisticsOrderStart',

    'fetchGetMonthlyRevenueStatisticsOrderStart',
    'fetchGetCategoryMonthlyRevenueStatisticsOrderStart',
    'fetchGetTypeMonthlyRevenueStatisticsOrderStart',

    'fetchGetMonthlyLoginStatisticsStart,',
    'fetchGetCountUserRoleStatisticsStart',
    'fetchGetTopRevenueCustomersStatisticsStart',
]

export const ROLE_ACTIONS_PHARMACIST = [
    'fetchGetApproveRequestOrderStart',
    'fetchChangePasswordPharmacistStart',
    'fetchForgotPasswordPharmacistStart',
    'fetchApproveProductByPharmacistStart',
    'loginPharmacistStart',
    'fetchAcceptConversationStart'
]

export const SYSTEM_ACTIONS = [
    'PERSIST',
    'REHYDRATE',
    'PAUSE',
    'PURGE',
    'REGISTER',
    'FLUSH',
    '@@redux/INIT',
    '@@INIT'
];