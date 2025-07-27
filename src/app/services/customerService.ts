import { AxiosError } from "axios";
import api from "../api/axiosInstance";
import { Customer, CustomerGroup } from "@/types";

export async function getCustomers(): Promise<Customer[]> {
  const res = await api.get("/api/customers");
  if (!res.data?.length) return [];
  return res.data as Customer[];
}

export async function getCustomersGroup(): Promise<CustomerGroup[]> {
  const res = await api.get("/api/customers/groups");
  if (!res.data?.length) return [];
  return res.data as CustomerGroup[];
}

export async function saveCustomer(
  product: {
    code: string,
    name: string,
    dni: string,
    email: string,
    documentType: string,
    customerGroupId?: string
  }
): Promise<string> {
  try {
    const res = await api.post("/api/customers", product);
    if (res.status === 409) return 'El código del cliente ya existe';
    return '';
  } catch (error) {
    if (error as AxiosError) {
      if ((error as AxiosError).response?.status === 409) return 'El código del cliente ya existe';
    }
  }
  return '';
}