import { call, put, takeLatest } from 'redux-saga/effects';
import * as productService from '@/services/productService';
import {
    fetchProductBySlugStart,
    fetchProductBySlugSuccess,
    fetchProductBySlugFailed,

    fetchAddProductStart,
    fetchAddProductSuccess,
    fetchAddProductFailed,

    fetchAllProductAdminStart,
    fetchAllProductAdminSuccess,
    fetchAllProductAdminFailed,

    fetchAllProductTopSellingStart,
    fetchAllProductTopSellingSuccess,
    fetchAllProductTopSellingFailed,

    fetchAllProductRelatedStart,
    fetchAllProductRelatedSuccess,
    fetchAllProductRelatedFailed,

    fetchAllProductGetRecentlyViewedStart,
    fetchAllProductGetRecentlyViewedSuccess,
    fetchAllProductGetRecentlyViewedFailed,

    fetchAllProductGetProductFeaturedStart,
    fetchAllProductGetProductFeaturedSuccess,
    fetchAllProductGetProductFeaturedFailed,

    fetchAllProductBestDealStart,
    fetchAllProductBestDealSuccess,
    fetchAllProductBestDealFailed,

    fetchDeleteProductFailed,
    fetchDeleteProductStart,
    fetchDeleteProductSuccess,

    fetchProductApprovedFailed,
    fetchProductApprovedStart,
    fetchProductApprovedSuccess,

    fetchApproveProductByPharmacistFailed,
    fetchApproveProductByPharmacistStart,
    fetchApproveProductByPharmacistSuccess,
} from './productSlice';
import { getSession, getToken, setSession } from '@/utils/cookie';

// Fetch product Featured
function* fetchProductFeatured(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            mainCategory,
            subCategory,
            childCategory,
            top_n,
            onSuccess = () => { },
            onFailed = () => { }
        } = payload;

        interface ProductData {
            main_category_id?: string | null;
            sub_category_id?: string | null;
            child_category_id?: string | null;
            top_n?: number | null;
        }
        
        const data: ProductData = {}
        
        if (mainCategory) {
            data.main_category_id = mainCategory;
        }
        if (subCategory) {
            data.sub_category_id = subCategory;
        }
        if (childCategory) {
            data.child_category_id = childCategory;
        }
        data.top_n = top_n;

        const product = yield call(productService.getProductFeatured, data);
        if (product.status_code === 200) {
            onSuccess();
            yield put(fetchAllProductGetProductFeaturedSuccess(product.data));
            return;
        }
        onFailed();
        yield put(fetchAllProductGetProductFeaturedFailed());
    } catch (error) {
        yield put(fetchAllProductGetProductFeaturedFailed());
    }
}
// Fetch product by slug
function* fetchProductBySlug(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            slug,
            onSucces = () => { },
            onFailed = () => { }
        } = payload;
        const token: any= getToken();
        const session = getSession();
        const product = token ?
            yield call(productService.getProductBySlug, slug) :
            yield call(productService.getProductBySlugSession, slug, session)
            ;
        if (product?.status_code === 200) {
            onSucces();
            yield put(fetchProductBySlugSuccess(product?.data?.product));
            if (product?.data?.session_id && product?.data?.session_id !== session) {
                setSession(product?.data?.session_id);
            }
            return;
        }
        onFailed()
        yield put(fetchProductBySlugFailed("Product not found"));

    } catch (error) {
        yield put(fetchProductBySlugFailed("Failed to fetch product by slug"));
    }
}

// Add product reviewed
function* fetchGetProductGetRecentlyViewed(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const token: any = getToken();
        const session = getSession();

        const product:any = token ?
            yield call(productService.getProductReviewToken) :
            yield call(productService.getProductReviewSession, session)
            ;

        if (product?.status_code === 200) {
            yield put(fetchAllProductGetRecentlyViewedSuccess(product?.data));
            return;
        }
        yield put(fetchAllProductGetRecentlyViewedFailed());
    }
    catch (error) {
        yield put(fetchAllProductGetRecentlyViewedFailed());
    }
}

function* handlerAddProduct(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            form,
            onsucces = () => { },
            onfailed = () => { }
        } = payload;

        // const formData = new FormData();

        // Object.entries(form).forEach(([key, value]) => {
        //     if (key !== 'images' && key !== 'thumbnail' && value !== undefined) {
        //         formData.append(key, value as string);
        //     }
        // });

        // if (form.thumbnail instanceof File) {
        //     formData.append('thumbnail', form.thumbnail);
        // }

        // if (form.images && Array.isArray(form.images)) {
        //     form.images.forEach((file: File, index: number) => {
        //         if (file instanceof File) {
        //             formData.append(`images[${index}]`, file);
        //         }
        //     });
        // }

        // if (form.attributes && typeof form.attributes === 'object') {
        //     formData.append('attributes', JSON.stringify(form.attributes));
        // }

        // console.log("formData", formData);

        const product = yield call(productService.addProduct, form);
        console.log("product", product);
        if (product.status_code === 200) {
            onsucces(product.message);
            yield put(fetchAddProductSuccess());
            return;
        }
        console.log("test",product.message);
        onfailed(product.message);
        
        yield put(fetchAddProductFailed(
            product.message || "Failed to add product"

        ));

    } catch (error) {
        yield put(fetchAddProductFailed(
            "Failed to add product"
        ));
        
        console.log("final",error);

    }
}

function* handlerGetAllProductAdmin(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(productService.getAllProductAdmin, payload);
        if (product.status_code === 200) {
            yield put(fetchAllProductAdminSuccess(product.data));
            return;
        }
        yield put(fetchAllProductAdminFailed("Product not found"));
    } catch (error) {
        yield put(fetchAllProductAdminFailed("Failed to fetch product by slug"));
    }
}

// Fetch all product top selling
function* handlerGetAllProductTopSelling(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(productService.getProductTopSelling, payload);
        if (product.status_code === 200) {
            yield put(fetchAllProductTopSellingSuccess(product.data));
            return;
        }
        yield put(fetchAllProductTopSellingFailed("Product not found"));
    } catch (error) {
        yield put(fetchAllProductTopSellingFailed("Failed to fetch product by slug"));
    }
}

// Fetch all product related
function* handlerGetAllProductRelated(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(productService.getProductsRelated, payload);
        if (product.status_code === 200) {
            yield put(fetchAllProductRelatedSuccess(product.data));
            return;
        }
        yield put(fetchAllProductRelatedFailed("Product not found"));
    }
    catch (error) {
        yield put(fetchAllProductRelatedFailed("Failed to fetch product by slug"));
    }
}

// Fetch all product best deal
function* handlerGetAllProductBestDeal(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(productService.getProductsBestDeal, payload);
        if (product.status_code === 200) {
            yield put(fetchAllProductBestDealSuccess(product.data));
            return;
        }
        yield put(fetchAllProductBestDealFailed("Product not found"));
    } catch (error) {
        yield put(fetchAllProductBestDealFailed("Failed to fetch product by slug"));
    }
}

// Fetch delete product
function* handlerDeleteProduct(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;

        const {
            product_id,
            onSuccess = (message: any) => {},
            onFailure = (message: any) => {}
        } = payload;
        const product = yield call(productService.deleteProduct, product_id);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchDeleteProductSuccess(product.message));
            return;
        }
        onFailure(product.message);
        yield put(fetchDeleteProductFailed(product.message));

    } catch (error) {
        yield put(fetchDeleteProductFailed("Failed to fetch product by slug"));
    }
}

function* getAllProductApproved(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const product = yield call(productService.getAllProductApproved);
        if (product.status_code === 200) {
            yield put(fetchProductApprovedSuccess(product.data));
            return;
        }
        yield put(fetchProductApprovedFailed("Product not found"));
    } catch (error) {
        yield put(fetchProductApprovedFailed("Failed to fetch product by slug"));
    }
}

function * handleApproveProduct(action: any): Generator<any, void, any> {
    try {
        const { payload } = action;
        const {
            product_id,
            rejected_note,
            is_approved,
            onSuccess = (message: any) => {},
            onFailure = (message: any) => {}
        } = payload;
        const body = {
            product_id,
            rejected_note,
            is_approved

        };
        const product = yield call(productService.approveProductByPharmacist, body);
        if (product.status_code === 200) {
            onSuccess(product.message);
            yield put(fetchApproveProductByPharmacistSuccess(product.message));
            return;
        }
        onFailure(product.message);
        yield put(fetchApproveProductByPharmacistFailed(product.message));
    } catch (error) {
        yield put(fetchApproveProductByPharmacistFailed("Failed to fetch product by slug"));
    }
}

function* handleUpdateProduct(action: any): Generator<any, void, any> {
    try {
      const { payload } = action;
      const {
        product_id,
        product_name,
        name_primary,
        prices,
        inventory,
        slug,
        description,
        full_description,
        category,
        origin,
        ingredients,
        uses,
        dosage,
        side_effects,
        precautions,
        storage,
        manufacturer,
        dosage_form,
        brand,
        prescription_required,
        registration_number,
        onSuccess = () => {},
        onFailed = () => {},
      } = payload;
  
      const body = {
        product_id,
        product_name,
        name_primary,
        prices: {
          prices: prices?.prices || [],
        },
        inventory,
        slug,
        description,
        full_description,
        category: {
          main_category_id: category?.main_category_id || '',
          sub_category_id: category?.sub_category_id || '',
          child_category_id: category?.child_category_id || '',
        },
        origin,
        ingredients: {
          ingredients: ingredients?.ingredients || [],
        },
        uses,
        dosage,
        side_effects,
        precautions,
        storage,
        manufacturer: {
          manufacture_name: manufacturer?.manufacture_name || '',
          manufacture_address: manufacturer?.manufacture_address || '',
          manufacture_contact: manufacturer?.manufacture_contact || '',
        },
        dosage_form,
        brand,
        prescription_required,
        registration_number,
      };
  
      const product = yield call(productService.updateProduct, body);
      if (product.status_code === 200) {
        onSuccess(product.message);
        yield put(fetchAddProductSuccess());
        return;
      }
  
      onFailed(product.message);
      yield put(
        fetchAddProductFailed(product.message || 'Failed to update product')
      );
    } catch (error) {
      yield put(fetchAddProductFailed('Failed to update product'));
    }
  }
  


export function* productSaga() {
    yield takeLatest(fetchProductBySlugStart.type, fetchProductBySlug);
    yield takeLatest(fetchAddProductStart.type, handlerAddProduct);
    yield takeLatest(fetchAllProductAdminStart.type, handlerGetAllProductAdmin);
    yield takeLatest(fetchAllProductTopSellingStart.type, handlerGetAllProductTopSelling);
    yield takeLatest(fetchAllProductRelatedStart.type, handlerGetAllProductRelated);
    yield takeLatest(fetchAllProductGetRecentlyViewedStart.type, fetchGetProductGetRecentlyViewed);
    yield takeLatest(fetchAllProductGetProductFeaturedStart.type, fetchProductFeatured);
    yield takeLatest(fetchAllProductBestDealStart.type, handlerGetAllProductBestDeal);
    yield takeLatest(fetchDeleteProductStart.type, handlerDeleteProduct);
    yield takeLatest(fetchProductApprovedStart.type, getAllProductApproved);
    yield takeLatest(fetchApproveProductByPharmacistStart.type, handleApproveProduct);
}
