export interface CreateOrderData {
  customer: string;
  items: any[];
  total: number;
  status: string;
}

export interface IOrderRepository {
  findProductById(id: number): Promise<any>;
  create(data: CreateOrderData): Promise<{ id: number }>;
}
