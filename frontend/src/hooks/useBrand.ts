import { all } from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import { selectAllBrand } from '@/store/brand/brandSelector';
import { fetchGetAllBrandAdminStart } from '@/store';


export function useBrand() {
    const dispatch = useDispatch();
    const getAllBrandsAdmin = useSelector(selectAllBrand);
    const fetchAllBrandsAdmin = (onSuccess: () => void, onFailure: () => void, ) => {
        dispatch(fetchGetAllBrandAdminStart(
            {
                onSuccess: onSuccess,
                onFailure: onFailure,
              
            }
        ));
    };

   
   


    
    return {
        getAllBrandsAdmin,
        fetchAllBrandsAdmin,
       
    };
}

