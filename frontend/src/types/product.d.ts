export interface ProductSliceState {
    listProduct: Product[];
    loading: boolean;
}

interface Product {
    key: string,
    _id: string,
    name: string,
    uint: string,
    stock: number
}