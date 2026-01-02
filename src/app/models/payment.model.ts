export interface Payment {
  id?: number;
  amount: number;
  paymentDate: Date | string;
  paymentMethod: 'CASH' | 'CARD' | 'TRANSFER' | 'CHECK';
  factureId?: number;
}
