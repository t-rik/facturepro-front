import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <img src="assets/logo.png" alt="FacturePro" class="logo-img">
          <span class="logo-text">FacturePro</span>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-category">Général</div>
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span>Tableau de bord</span>
        </a>

        <div class="nav-category">Gestion</div>
        <a routerLink="/clients" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span>Clients</span>
        </a>
        
        <a routerLink="/factures" routerLinkActive="active" class="nav-item">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span>Factures</span>
        </a>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-item">
          <div class="avatar">{{ getUserInitial() }}</div>
          <div class="user-info">
            <span class="user-name">{{ getUsername() }}</span>
            <span class="user-role">{{ getUserRole() }}</span>
          </div>
        </div>
        <button class="logout-btn" (click)="logout()">
          Déconnexion
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--sidebar-width);
      background: var(--slate-950);
      border-right: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      z-index: 100;
    }

    .sidebar-header {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 1.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-img {
      width: 100%;
      height: 100%;
      object-fit: contain;

    .logo-text {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 1rem;
      overflow-y: auto;
    }

    .nav-category {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 1.5rem 0 0.5rem 0.75rem;
    }

    .nav-category:first-child {
      margin-top: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      color: var(--text-secondary);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      text-decoration: none;
      margin-bottom: 0.25rem;
    }

    .nav-item:hover {
      background: var(--slate-900);
      color: var(--text-primary);
    }

    .nav-item.active {
      background: var(--primary-600);
      color: white;
    }

    .nav-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--border-light);
      background: var(--slate-950);
    }

    .user-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
      padding: 0.5rem;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--slate-800);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.875rem;
      border: 1px solid var(--border-light);
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    .logout-btn {
      width: 100%;
      padding: 0.5rem;
      background: transparent;
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    .logout-btn:hover {
      background: var(--slate-900);
      color: var(--text-primary);
    }
  `]
})
export class SidebarComponent {
  constructor(
    public themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  getUsername(): string {
    return this.authService.getUser()?.username || 'User';
  }

  getUserRole(): string {
    return this.authService.getUser()?.role || 'USER';
  }

  getUserInitial(): string {
    const username = this.getUsername();
    return username.charAt(0).toUpperCase();
  }
}
