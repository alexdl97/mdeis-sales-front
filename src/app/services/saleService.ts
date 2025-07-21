import api from "../api/axiosInstance";
import { SaleInvoice } from "@/types";

export async function getSales(): Promise<SaleInvoice[]> {
  const res = await api.get("/api/sale-invoices");
  if (!res.data?.length) return [];
  return res.data as SaleInvoice[];
}

export async function saveSaleInvoce(body: SaleInvoice): Promise<boolean> {
  const res = await api.post("/api/sale-invoices", body);
  return res.status === 201;
}
