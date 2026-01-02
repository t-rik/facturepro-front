import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div 
        *ngFor="let toast of (toastService.toasts$ | async)" 
        class="toast" 
        [class.success]="toast.type === 'success'"
        [class.error]="toast.type === 'error'"
        [class.warning]="toast.type === 'warning'"
        [class.info]="toast.type === 'info'"
        (click)="toastService.remove(toast.id)">
        <span class="toast-icon">
          <ng-container [ngSwitch]="toast.type">
            <svg *ngSwitchCase="'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <svg *ngSwitchCase="'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
            <svg *ngSwitchCase="'warning'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <svg *ngSwitchDefault width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </ng-container>
        </span>
        <span class="toast-message">{{ toast.message }}</span>
        <span class="toast-close">×</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }
    
    .toast {
      display: flex;
      align-items: center;
      gap: 0.875rem;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-lg);
      cursor: pointer;
      animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      color: white;
      font-weight: 500;
      font-size: 0.9375rem;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .toast.success { 
      background: var(--bg-surface);
      border-left: 4px solid var(--success);
      box-shadow: var(--shadow-md);
    }
    .toast.success .toast-icon { color: var(--success); }
    
    .toast.error { 
      background: var(--bg-surface);
      border-left: 4px solid var(--danger);
      box-shadow: var(--shadow-md);
    }
    .toast.error .toast-icon { color: var(--danger); }
    
    .toast.warning { 
      background: var(--bg-surface);
      border-left: 4px solid var(--warning);
      box-shadow: var(--shadow-md);
    }
    .toast.warning .toast-icon { color: var(--warning); }
    
    .toast.info { 
      background: var(--bg-surface);
      border-left: 4px solid var(--primary-500);
      box-shadow: var(--shadow-md);
    }
    .toast.info .toast-icon { color: var(--primary-500); }
    
    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .toast-message {
      flex: 1;
    }

    .toast-close {
      font-size: 1.5rem;
      line-height: 1;
      opacity: 0.7;
      transition: opacity 0.15s;
    }

    .toast:hover .toast-close {
      opacity: 1;
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
