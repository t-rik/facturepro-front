import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">
            <img src="assets/logo.png" alt="FacturePro" class="logo-img">
            <span class="logo-text">FacturePro</span>
        </div>

        <div class="verification-content">
          @if (loading) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Vérification en cours...</p>
            </div>
          } @else if (success) {
            <div class="success-state">
              <svg class="status-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h2>Email vérifié !</h2>
              <p>Votre compte a été activé avec succès.</p>
              <a routerLink="/login" class="btn btn-primary">Se connecter</a>
            </div>
          } @else {
            <div class="error-state">
              <svg class="status-icon error" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <h2>Erreur de vérification</h2>
              <p>{{ errorMessage }}</p>
              <a routerLink="/login" class="btn btn-secondary">Retour à la connexion</a>
            </div>
          }
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

    .verification-content {
      text-align: center;
    }

    .loading-state, .success-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--border-light);
      border-top-color: var(--primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .status-icon {
      width: 64px;
      height: 64px;
    }

    .status-icon.success { color: var(--success); }
    .status-icon.error { color: var(--danger); }

    h2 {
      font-size: 1.5rem;
      color: var(--text-primary);
      margin: 0;
    }

    p {
      color: var(--text-secondary);
      margin: 0;
    }

    .btn {
      margin-top: 1rem;
    }
  `]
})
export class VerifyEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  loading = true;
  success = false;
  errorMessage = '';

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    
    if (!token) {
      this.loading = false;
      this.errorMessage = 'Token de vérification manquant';
      return;
    }

    this.http.get<{message: string}>(`${environment.apiUrl}/auth/verify-email?token=${token}`)
      .subscribe({
        next: () => {
          this.loading = false;
          this.success = true;
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err.error?.message || 'Erreur lors de la vérification';
        }
      });
  }
}
