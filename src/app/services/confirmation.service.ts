import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

export type ConfirmationType = 'danger' | 'warning' | 'info';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private _isOpen = signal(false);
  private _options = signal<ConfirmationOptions>({
    title: '',
    message: ''
  });
  
  private _confirmationSubject = new Subject<boolean>();

  // Expose signals for component
  isOpen = this._isOpen.asReadonly();
  options = this._options.asReadonly();

  confirm(options: ConfirmationOptions): Promise<boolean> {
    this._options.set({
      confirmText: 'Confirmer',
      cancelText: 'Annuler',
      type: 'info',
      ...options
    });
    this._isOpen.set(true);
    
    // Reset subject for new confirmation
    this._confirmationSubject = new Subject<boolean>();
    
    return new Promise((resolve) => {
      this._confirmationSubject.subscribe({
        next: (result) => {
          this._isOpen.set(false);
          resolve(result);
        }
      });
    });
  }

  resolve(result: boolean) {
    this._confirmationSubject.next(result);
    this._confirmationSubject.complete();
  }
}
