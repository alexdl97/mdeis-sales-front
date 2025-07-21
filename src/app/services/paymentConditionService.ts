import api from "../api/axiosInstance";
import { PaymentCondition } from "@/types";

export async function getPaymentsConditions(): Promise<PaymentCondition[]> {
  const res = await api.get("/api/payment-conditions");
  if (!res.data?.length) return [];
  return res.data as PaymentCondition[];
}