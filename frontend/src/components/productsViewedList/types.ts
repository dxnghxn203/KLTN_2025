import { StaticImageData } from "next/image";

export interface ProductData {
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
