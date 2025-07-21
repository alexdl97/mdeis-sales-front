import api from "../api/axiosInstance";
import { Customer } from "@/types";

export async function getCustomers(): Promise<Customer[]> {
  const res = await api.get("/api/customers");
  if (!res.data?.length) return [];
  return res.data as Customer[];
}