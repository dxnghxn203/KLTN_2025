import { useDispatch, useSelector } from 'react-redux';

import { CartItem } from '@/types/cart';
import { addCartLocal, clearCartLocal, removeCartLocal, selectCartError, selectCartLoading, selectCartLocal, updateQuantityCartLocal, updateUnitCartLocal } from '@/store';

export function useCart() {
    const dispatch = useDispatch();

    const cartLocal = useSelector(selectCartLocal);
    const isLoading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);

    const addToCart = (item: CartItem) => {
        dispatch(addCartLocal(item));
    };

    const updateQuantity = (id: string, quantity: number) => {
        dispatch(updateQuantityCartLocal({ id, quantity }));
    };

    const updateUnit=(id:string, unit: string)=>{
        dispatch(updateUnitCartLocal({id, unit}))
    }

    const removeFromCart = (id: string) => {
        dispatch(removeCartLocal(id));
    };

    const clearCart = () => {
        dispatch(clearCartLocal());
    };

    return {
        cartLocal,
        isLoading,
        error,
        addToCart,
        updateQuantity,
        updateUnit,
        removeFromCart,
        clearCart
    };
}

