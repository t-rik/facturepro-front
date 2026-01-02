import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastComponent } from './components/toast/toast.component';
import { AuthService } from './services/auth.service';

import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, ToastComponent, ConfirmationModalComponent],
  template: `
    <app-toast />
    <app-confirmation-modal />
    <div class="app-layout" *ngIf="authService.isAuthenticated(); else authLayout">
      <app-sidebar />
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
    <ng-template #authLayout>
      <router-outlet />
    </ng-template>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: var(--aurora-dark);
    }

    .main-content {
      flex: 1;
      margin-left: var(--sidebar-width);
      background: var(--aurora-dark);
      min-height: 100vh;
      position: relative;
    }

    .main-content::before {
      content: '';
      position: fixed;
      top: 0;
      right: 0;
      width: 50%;
      height: 50%;
      background: radial-gradient(ellipse at top right, rgba(139, 92, 246, 0.08) 0%, transparent 50%);
      pointer-events: none;
    }
  `]
})
export class App {
  title = 'FacturePro';

  constructor(public authService: AuthService, private router: Router) {}
}
