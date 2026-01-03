import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="logo">
              <img src="assets/logo.png" alt="FacturePro" class="logo-img">
              <span class="logo-text">FacturePro</span>
            </div>
            <h1>Créer un compte</h1>
            <p>Démarrez votre période d'essai gratuite</p>
          </div>
          
          <form (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label for="username" class="form-label">Nom d'utilisateur</label>
              <input 
                type="text" 
                id="username" 
                [(ngModel)]="username" 
                name="username"
                class="form-control"
                required>
            </div>

            <div class="form-group">
              <label for="email" class="form-label">Email professionnel</label>
              <input 
                type="email" 
                id="email" 
                [(ngModel)]="email" 
                name="email"
                class="form-control"
                required>
            </div>
            
            <div class="form-group">
              <label for="password" class="form-label">Mot de passe</label>
              <input 
                type="password" 
                id="password" 
                [(ngModel)]="password" 
                name="password"
                class="form-control"
                required>
            </div>
            
            <div *ngIf="error" class="error-message">
              {{ error }}
            </div>

            <div *ngIf="successMessage" class="success-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p>{{ successMessage }}</p>
              <a routerLink="/login" class="btn btn-primary">Se connecter</a>
            </div>
            
            <button *ngIf="!successMessage" type="submit" class="btn btn-primary btn-block" [disabled]="loading">
              {{ loading ? 'Création...' : "S'inscrire" }}
            </button>
          </form>
          
          <div class="auth-footer" *ngIf="!successMessage">
            <p>Déjà client ? <a routerLink="/login">Se connecter</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--bg-body);
      background-image: 
        radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.05) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(15, 23, 42, 0.5) 0px, transparent 50%);
    }

    .auth-container {
      width: 100%;
      max-width: 400px;
      padding: 1rem;
    }

    .auth-card {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
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

    .logo-box {
      width: 36px;
      height: 36px;
      background: var(--primary-600);
      color: white;
      font-weight: 700;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    .logo-text {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .auth-header h1 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-group {
      margin-bottom: 0.5rem;
    }

    .btn-block {
      width: 100%;
      padding: 0.75rem;
      margin-top: 0.5rem;
    }

    .error-message {
      color: var(--danger);
      background: var(--danger-bg);
      padding: 0.75rem;
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-light);
    }

    .auth-footer p {
      margin: 0;
      font-size: 0.875rem;
    }

    .success-message {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1.5rem;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--success);
      border-radius: var(--radius-md);
    }

    .success-message svg {
      width: 48px;
      height: 48px;
      color: var(--success);
      margin-bottom: 1rem;
    }

    .success-message p {
      color: var(--success);
      margin-bottom: 1rem;
    }
  `]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  error = '';
  successMessage = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.register({ username: this.username, email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }
}
