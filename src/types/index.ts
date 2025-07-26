
export interface CustomerGroup {
    id: string;
    name: string;
    discountPercentage: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Customer {
  id: string;
  name: string;
  code: string;
  dni: string;
  email: string;
  customerGroupId?: string;
  customerGroup: CustomerGroup;
  createdAt?: string;
  updatedAt?: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentCondition {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductGroup {
  id: string;
  name: string;
  discountPercentage: number;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  price: number;
  productGroupId?: string;
  productGroup: ProductGroup;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaleInvoice {
  customerId: string;
  warehouseId: string;
  paymentConditionId: string;
  taxName: string;
  taxId: string;
  saleInvoiceItems: SaleInvoceItem[]
  totalAmount?: number;
  customer?: Customer;
  warehouse?: Warehouse;
  paymentCondition?: PaymentCondition;
}

export interface SaleInvoceItem {
  product?: Product;
  productId: string;
  quantity: number;
}

export interface SaleInvoceDetail {
  productName: string;
  productId: string;
  quantity: number;
  productPrice: number;
  productDiscount: number;
  customerDiscount: number;
  totalPrice: number;
}