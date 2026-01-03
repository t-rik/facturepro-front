import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <span class="logo-icon">FP</span>
            <span class="logo-text">FacturePro</span>
          </div>
          <h1>Mot de passe oublié</h1>
          <p class="text-muted">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        @if (successMessage()) {
          <div class="alert alert-success">
            {{ successMessage() }}
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()" class="auth-form">
            @if (errorMessage()) {
              <div class="alert alert-danger">{{ errorMessage() }}</div>
            }

            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                name="email"
                class="form-control"
                placeholder="votre@email.com"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary btn-block" [disabled]="loading()">
              {{ loading() ? 'Envoi...' : 'Envoyer le lien' }}
            </button>
          </form>
        }

        <div class="auth-footer">
          <a routerLink="/login">Retour à la connexion</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: linear-gradient(135deg, var(--slate-950) 0%, var(--slate-900) 100%);
    }

    .auth-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
      box-shadow: var(--shadow-lg);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .logo-icon {
      background: var(--primary-500);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 1rem;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    h1 {
      font-size: 1.5rem;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
    }

    .btn-block {
      width: 100%;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
    }

    .auth-footer a {
      color: var(--primary-400);
      text-decoration: none;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    .alert {
      padding: 1rem;
      border-radius: var(--radius-md);
      margin-bottom: 1rem;
    }

    .alert-success {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--success);
      color: var(--success);
    }

    .alert-danger {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--danger);
      color: var(--danger);
    }
  `]
})
export class ForgotPasswordComponent {
  private http = inject(HttpClient);

  email = '';
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  onSubmit() {
    if (!this.email) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.http.post<{message: string}>(`${environment.apiUrl}/auth/forgot-password`, { email: this.email })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          this.successMessage.set(res.message);
        },
        error: (err) => {
          this.loading.set(false);
          this.errorMessage.set(err.error?.message || 'Erreur lors de l\'envoi');
        }
      });
  }
}
