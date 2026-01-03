import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <img src="assets/logo.png" alt="FacturePro" class="logo-img">
            <span class="logo-text">FacturePro</span>
          <h1>Nouveau mot de passe</h1>
          <p class="text-muted">Entrez votre nouveau mot de passe</p>
        </div>

        @if (successMessage()) {
          <div class="success-state">
            <svg class="status-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p>{{ successMessage() }}</p>
            <a routerLink="/login" class="btn btn-primary">Se connecter</a>
          </div>
        } @else if (!token) {
          <div class="error-state">
            <p class="alert alert-danger">Token de réinitialisation manquant</p>
            <a routerLink="/forgot-password" class="btn btn-secondary">Demander un nouveau lien</a>
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()" class="auth-form">
            @if (errorMessage()) {
              <div class="alert alert-danger">{{ errorMessage() }}</div>
            }

            <div class="form-group">
              <label for="password">Nouveau mot de passe</label>
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                class="form-control"
                placeholder="••••••••"
                minlength="6"
                required
              />
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <input
                type="password"
                id="confirmPassword"
                [(ngModel)]="confirmPassword"
                name="confirmPassword"
                class="form-control"
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" class="btn btn-primary btn-block" [disabled]="loading()">
              {{ loading() ? 'Réinitialisation...' : 'Réinitialiser' }}
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

    .success-state, .error-state {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .status-icon {
      width: 48px;
      height: 48px;
      color: var(--success);
    }

    .alert {
      padding: 1rem;
      border-radius: var(--radius-md);
      width: 100%;
    }

    .alert-danger {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--danger);
      color: var(--danger);
    }
  `]
})
export class ResetPasswordComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  token: string | null = null;
  password = '';
  confirmPassword = '';
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas');
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.http.post<{message: string}>(`${environment.apiUrl}/auth/reset-password`, {
      token: this.token,
      newPassword: this.password
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.successMessage.set(res.message);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Erreur lors de la réinitialisation');
      }
    });
  }
}
