import { StaticImageData } from "next/image";

export interface ProductData {
  discount?: string;
  imageSrc: string | StaticImageData; // Hỗ trợ import ảnh
  category: string;
  rating: number;
  name: string;
  price: string;
  originalPrice?: string;
}
