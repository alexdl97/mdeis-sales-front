import { Product } from "@/types";
import api from "../api/axiosInstance";

export async function getProducts(): Promise<Product[]> {
  const res = await api.get("/api/products");
  if (!res.data?.length) return [];
  return res.data as Product[];
}
