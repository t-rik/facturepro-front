import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';
import { Payment } from '../../models/payment.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="payment-modal-overlay" (click)="onClose()">
      <div class="payment-modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Enregistrer un paiement</h3>
          <button class="btn-close" (click)="onClose()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="modal-body">
          <div class="form-group">
            <label class="form-label">Montant (DH) *</label>
            <input 
              type="number" 
              class="form-control" 
              [(ngModel)]="payment.amount" 
              name="amount" 
              required 
              min="0.01">
          </div>

          <div class="form-group">
            <label class="form-label">Méthode de paiement *</label>
            <select class="form-control" [(ngModel)]="payment.paymentMethod" name="method" required>
              <option value="CASH">Espèces</option>
              <option value="CARD">Carte Bancaire</option>
              <option value="TRANSFER">Virement</option>
              <option value="CHECK">Chèque</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Date du paiement</label>
            <input type="date" class="form-control" [(ngModel)]="paymentDateStr" name="date">
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onClose()">Annuler</button>
            <button type="submit" class="btn btn-primary" [disabled]="submitting()">
              {{ submitting() ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .payment-modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    .payment-modal-card {
      background: var(--bg-card);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 450px;
      box-shadow: var(--shadow-xl);
      animation: slideUp 0.3s ease-out;
    }

    .modal-header {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 1.25rem;
    }

    .btn-close {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: var(--spacing-xs);
      border-radius: var(--radius-md);
      transition: all 0.2s;
    }

    .btn-close:hover {
      background: var(--bg-body);
      color: var(--text-primary);
    }

    .modal-body {
      padding: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .modal-footer {
      padding-top: var(--spacing-lg);
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class PaymentFormComponent {
  @Input({ required: true }) factureId!: number;
  @Input() remainingAmount: number = 0;
  @Output() close = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  private paymentService = inject(PaymentService);
  private toastService = inject(ToastService);

  submitting = signal(false);
  paymentDateStr = new Date().toISOString().split('T')[0];
  
  payment: Payment = {
    amount: 0,
    paymentDate: new Date(),
    paymentMethod: 'CASH'
  };

  ngOnInit() {
    this.payment.amount = this.remainingAmount;
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.payment.amount <= 0) {
      this.toastService.show('Montant invalide', 'error');
      return;
    }

    this.submitting.set(true);
    this.payment.paymentDate = new Date(this.paymentDateStr);
    
    this.paymentService.recordPayment(this.factureId, this.payment).subscribe({
      next: () => {
        this.toastService.show('Paiement enregistré avec succès', 'success');
        this.success.emit();
        this.onClose();
      },
      error: (err) => {
        console.error('Error recording payment:', err);
        this.toastService.show('Erreur lors de l’enregistrement du paiement', 'error');
        this.submitting.set(false);
      }
    });
  }
}
