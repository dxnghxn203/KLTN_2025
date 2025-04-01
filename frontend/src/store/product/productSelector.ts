
export const selectProduct = (state: any) => state.product;
export const selectProducts = (state: any) => state.product.products;
export const selectProductBySlug = (state: any) => state.product.product;
export const selectProductLoading = (state: any) => state.product.loading;
export const selectProductError = (state: any) => state.product.error;
export const selectProductAdmin = (state: any)=> state.product.productsAdmin;
export const selectProductTopSelling = (state: any) => state.product.productsTopSelling;
export const selectProductRelated = (state: any) => state.product.productsRelated;
export const selectProductGetRecentlyViewed = (state: any) => state.product.productsGetRecentlyViewed;