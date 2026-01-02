import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (confirmationService.isOpen()) {
      <div class="modal-overlay" (click)="cancel()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-icon" [class]="getIconClass()">
            <svg *ngIf="confirmationService.options().type === 'danger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <svg *ngIf="confirmationService.options().type !== 'danger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3>{{ confirmationService.options().title }}</h3>
          <p>{{ confirmationService.options().message }}</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" (click)="cancel()">
              {{ confirmationService.options().cancelText }}
            </button>
            <button 
              class="btn" 
              [ngClass]="getConfirmButtonClass()"
              (click)="confirm()">
              {{ confirmationService.options().confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.7);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .modal-content {
      background: var(--bg-card);
      width: 100%;
      max-width: 420px;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border-light);
      padding: 2rem;
      text-align: center;
      box-shadow: var(--shadow-lg);
      animation: scaleIn 0.25s ease-out;
    }

    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .modal-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
    }

    .modal-icon svg {
      width: 28px;
      height: 28px;
    }

    .modal-icon.danger {
      background: var(--danger-bg);
      color: var(--danger);
    }

    .modal-icon.info {
      background: rgba(59, 130, 246, 0.1);
      color: var(--primary-500);
    }

    .modal-icon.warning {
      background: var(--warning-bg);
      color: var(--warning);
    }

    .modal-content h3 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
    }

    .modal-content p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    .modal-actions {
      display: flex;
      justify-content: center;
      gap: var(--spacing-md);
    }

    .modal-actions .btn {
      min-width: 120px;
    }
  `]
})
export class ConfirmationModalComponent {
  confirmationService = inject(ConfirmationService);

  confirm() {
    this.confirmationService.resolve(true);
  }

  cancel() {
    this.confirmationService.resolve(false);
  }

  getConfirmButtonClass(): string {
    const type = this.confirmationService.options().type;
    switch (type) {
      case 'danger': return 'btn-danger';
      case 'warning': return 'btn-warning';
      default: return 'btn-primary';
    }
  }

  getIconClass(): string {
    return this.confirmationService.options().type || 'info';
  }
}
