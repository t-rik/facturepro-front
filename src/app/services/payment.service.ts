import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/payments`;

  getPaymentsByFacture(factureId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/facture/${factureId}`);
  }

  recordPayment(factureId: number, payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/facture/${factureId}`, payment);
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
