import { StaticImageData } from "next/image";

export interface ProductData {
  discount?: string;
  imageSrc: string | StaticImageData; 
  category: string;
  rating: number;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
}
