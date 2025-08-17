export type PaymentStatusT = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface PaymentI {
  id: string;
  amount: number;
  status: PaymentStatusT;
  createdAt: string;
  updatedAt: string;
}
