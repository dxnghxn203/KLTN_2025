export interface ProductSliceState {
    listProduct: Product[];
    loading: boolean;
}

interface ProductInStock {
    key: string,
    _id: string,
    name: string,
    uint: string,
    stock: number
}

interface Product {
    id: string;
    name: string;
    price: number;
    discount: string;
    originPrice: number;
    imageSrc: string | StaticImageData;
    unit: string;
    quantity: number
}
interface ProductData {
    id: string,
  discount?: string;
  imageSrc: string | StaticImageData; 
  category: string;
  rating: number;
  name: string;
  price: number;
  originPrice?: number;
  unit: string;
}

interface Price {
    id: string;
    price: number;
    originalPrice: number;
    unitPrice: string;
    discount: number;
    unit: string[];
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductImage {
    id: number;
    url: string;
}
