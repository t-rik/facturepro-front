import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <div class="logo">
              <span class="logo-box">FP</span>
              <span class="logo-text">FacturePro</span>
            </div>
            <h1>Connexion</h1>
            <p>Accédez à votre espace administrateur</p>
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
                placeholder="Ex: admin"
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
                placeholder="••••••••"
                required>
            </div>
            
            <div *ngIf="error" class="error-message">
              {{ error }}
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>
          
          <div class="auth-footer">
            <p><a routerLink="/forgot-password">Mot de passe oublié ?</a></p>
            <p>Pas encore de compte ? <a routerLink="/register">S'inscrire</a></p>
          </div>
        </div>
        <div class="auth-brand-footer">
          <p>&copy; 2024 FacturePro Solutions. Sécurisé & Confidentiel.</p>
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

    .auth-brand-footer {
      text-align: center;
      margin-top: 2rem;
      color: var(--text-muted);
      font-size: 0.75rem;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Identifiants invalides';
      }
    });
  }
}
