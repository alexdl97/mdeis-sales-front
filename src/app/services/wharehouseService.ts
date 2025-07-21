import api from "../api/axiosInstance";
import { Warehouse } from "@/types";

export async function getWarehouses(): Promise<Warehouse[]> {
  const res = await api.get("/api/warehouses");
  if (!res.data?.length) return [];
  return res.data as Warehouse[];
}