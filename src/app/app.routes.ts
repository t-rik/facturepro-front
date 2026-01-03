import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ClientListComponent } from './pages/clients/client-list.component';
import { ClientFormComponent } from './pages/clients/client-form.component';
import { FactureListComponent } from './pages/factures/facture-list.component';
import { FactureFormComponent } from './pages/factures/facture-form.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { VerifyEmailComponent } from './pages/auth/verify-email.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password.component';
import { AuthGuard } from './guards/auth.guard';

import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [guestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'clients', component: ClientListComponent, canActivate: [AuthGuard] },
  { path: 'clients/new', component: ClientFormComponent, canActivate: [AuthGuard] },
  { path: 'clients/:id/edit', component: ClientFormComponent, canActivate: [AuthGuard] },
  { path: 'factures', component: FactureListComponent, canActivate: [AuthGuard] },
  { path: 'factures/new', component: FactureFormComponent, canActivate: [AuthGuard] },
  { path: 'factures/:id/edit', component: FactureFormComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' }
];

