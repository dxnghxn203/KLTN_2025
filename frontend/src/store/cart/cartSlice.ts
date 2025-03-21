import { CartState, CartItem } from "@/types/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CartState = {
    cartlocal: [] as CartItem[],  
    cart: [] as CartItem[],      
    cartSelected: [],
    loading: false,
    error: null,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // cart local
        addCartLocal: (state, action: PayloadAction<CartItem>) => {
            if (!Array.isArray(state.cartlocal)) {
                state.cartlocal = [];
            }

            const existingItem = state.cartlocal.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
                return;
            }
            
            state.cartlocal = [...state.cartlocal, action.payload];
        },
        updateQuantityCartLocal: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            if (!Array.isArray(state.cartlocal)) {
                state.cartlocal = [];
                return;
            }
            
            state.cartlocal = state.cartlocal.map((item) => {
                if (item.id === action.payload.id) {
                    return { ...item, quantity: item.quantity + action.payload.quantity };
                }
                return item;
            });
        },
        updateUnitCartLocal: (state, action: PayloadAction<{ id: string; unit: string }>) => {
            if (!Array.isArray(state.cartlocal)) {
                state.cartlocal = [];
                return;
            }
            
            state.cartlocal = state.cartlocal.map((item) => {
                if (item.id === action.payload.id) {
                    return { ...item, unit: action.payload.unit };
                }
                return item;
            });
        },
        removeCartLocal: (state, action: PayloadAction<string>) => {
            if (!Array.isArray(state.cartlocal)) {
                state.cartlocal = [];
                return;
            }
            
            state.cartlocal = state.cartlocal.filter((item) => item.id !== action.payload);
        },
        clearCartLocal: (state) => {
            state.cartlocal = [];
        },

        // product selected
        addCartSelected: (state, action: PayloadAction<string[]>) => {
            if (!Array.isArray(state.cartSelected)) {
                state.cartSelected = [];
            }

            state.cartSelected = action.payload;
        },
        removeCartSelected: (state, action: PayloadAction<string>) => {
            state.cartSelected = state.cartSelected.filter((item) => item !== action.payload);
        },

        // add cart
        addCartStart: (state) => {
            state.loading = true;
        },
        addCartSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = null;
        },
        addCartFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    addCartLocal,
    updateQuantityCartLocal,
    updateUnitCartLocal,
    removeCartLocal,
    clearCartLocal,

    addCartSelected,
    removeCartSelected,

    addCartStart,
    addCartSuccess,
    addCartFailure,
} = cartSlice.actions;

export default cartSlice.reducer;


