import { Product, ProductGroup } from "@/types";
import api from "../api/axiosInstance";
import { AxiosError } from "axios";

export async function getProducts(): Promise<Product[]> {
  const res = await api.get("/api/products");
  if (!res.data?.length) return [];
  return res.data as Product[];
}

export async function getProductsGroup(): Promise<ProductGroup[]> {
  const res = await api.get("/api/products/groups");
  if (!res.data?.length) return [];
  return res.data as ProductGroup[];
}

export async function saveProduct(
  product: {
    code: string,
    name: string,
    price: number,
    productGroupId?: string
  }
): Promise<string> {
  try {
    const res = await api.post("/api/products", product);
    if (res.status === 409) return 'El código del producto ya existe';
    return '';
  } catch (error) {
    if (error as AxiosError) {
      if ((error as AxiosError).response?.status === 409) return 'El código del producto ya existe';
    }
  }
  return '';
}