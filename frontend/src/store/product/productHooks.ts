import { useDispatch, useSelector } from 'react-redux';
import { listProductSelector, loadingSelector } from './productSelector';
import { fetchListProductStart } from './productSlice';

export const useProduct = () => {
    const dispatch = useDispatch();
    const listProduct = useSelector(listProductSelector);
    const loading = useSelector(loadingSelector);

    const fetchListProduct = () => {
        dispatch(fetchListProductStart());
    };

    return { listProduct, loading, fetchListProduct };
};