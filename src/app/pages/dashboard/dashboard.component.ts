import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { FactureService } from '../../services/facture.service';
import { Client } from '../../models/client.model';
import { Facture } from '../../models/facture.model';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, BaseChartDirective],
  template: `
    <div class="dashboard fade-in">
      <div class="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p class="text-muted">Bienvenue ! Voici un aperçu de votre activité.</p>
        </div>
        <div class="header-actions">
          <a routerLink="/factures/new" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 4v16m8-8H4"/>
            </svg>
            Nouvelle facture
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="card stat-card-wrapper">
          <div class="stat-icon revenue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Revenus encaissés</span>
            <span class="stat-value">{{ totalPaidRevenue() | number:'1.2-2' }} DH</span>
            <span class="stat-change positive">Mise à jour temps réel</span>
          </div>
        </div>

        <div class="card stat-card-wrapper">
          <div class="stat-icon invoices">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Total Facturé</span>
            <span class="stat-value">{{ totalFactureRevenue() | number:'1.2-2' }} DH</span>
            <span class="stat-change">{{ factures().length }} factures totales</span>
          </div>
        </div>

        <div class="card stat-card-wrapper">
          <div class="stat-icon clients">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">Clients actifs</span>
            <span class="stat-value">{{ clients().length }}</span>
            <span class="stat-change positive">+{{ latestClientsCount() }} ce mois</span>
          </div>
        </div>

        <div class="card stat-card-wrapper">
          <div class="stat-icon pending">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-label">En attente</span>
            <span class="stat-value">{{ pendingInvoicesCount() }}</span>
            <span class="stat-change danger">À relancer</span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section card">
        <div class="card-header">
          <h3>Évolution du Chiffre d'Affaires</h3>
        </div>
        <div class="card-body chart-container">
          <canvas baseChart
            [data]="lineChartData"
            [options]="lineChartOptions"
            [type]="'line'">
          </canvas>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid mt-xl">
        <!-- Recent Invoices -->
        <div class="card">
          <div class="card-header">
            <h3>Factures récentes</h3>
            <a routerLink="/factures" class="btn btn-ghost btn-sm">Voir tout</a>
          </div>
          <div class="card-body">
            @if (factures().length === 0) {
              <div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p class="empty-state-title">Aucune facture</p>
                <p class="empty-state-description">Créez votre première facture pour commencer.</p>
                <a routerLink="/factures/new" class="btn btn-primary">Créer une facture</a>
              </div>
            } @else {
              <div class="table-container">
                <table class="table">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>Client</th>
                      <th>Date</th>
                      <th class="text-right">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (facture of factures().slice(0, 5); track facture.id) {
                      <tr>
                        <td><span class="badge badge-info">#{{ facture.id }}</span></td>
                        <td>{{ facture.client?.nom || 'N/A' }}</td>
                        <td>{{ facture.dateFacture | date:'dd/MM/yyyy' }}</td>
                        <td class="text-right"><strong>{{ facture.montantTotal | number:'1.2-2' }} DH</strong></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>

        <!-- Recent Clients -->
        <div class="card">
          <div class="card-header">
            <h3>Clients récents</h3>
            <a routerLink="/clients" class="btn btn-ghost btn-sm">Voir tout</a>
          </div>
          <div class="card-body">
            @if (clients().length === 0) {
              <div class="empty-state">
                <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p class="empty-state-title">Aucun client</p>
                <p class="empty-state-description">Ajoutez votre premier client.</p>
                <a routerLink="/clients/new" class="btn btn-primary">Ajouter un client</a>
              </div>
            } @else {
              <div class="clients-list">
                @for (client of clients().slice(0, 5); track client.id) {
                  <div class="client-item">
                    <div class="client-avatar">{{ client.nom.charAt(0).toUpperCase() }}</div>
                    <div class="client-info">
                      <span class="client-name">{{ client.nom }}</span>
                      <span class="client-email">{{ client.email }}</span>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: var(--spacing-xl);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }

    .page-header h1 {
      margin: 0 0 0.5rem 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card-wrapper {
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: var(--shadow-sm);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--slate-800);
      color: var(--text-secondary);
    }

    .stat-icon svg {
      width: 24px;
      height: 24px;
    }

    /* Semantic accents for icons */
    .stat-icon.revenue { color: var(--success); background: rgba(16, 185, 129, 0.1); }
    .stat-icon.invoices { color: var(--primary-500); background: rgba(59, 130, 246, 0.1); }
    .stat-icon.clients { color: #8b5cf6; background: rgba(139, 92, 246, 0.1); }
    .stat-icon.pending { color: var(--warning); background: rgba(245, 158, 11, 0.1); }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .stat-change {
      font-size: 0.75rem;
      margin-top: 0.25rem;
      color: var(--text-muted);
    }

    .charts-section {
      margin-bottom: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
    }

    .card-header h3 {
      font-size: 1.125rem;
      margin: 0 0 1rem 0;
    }

    .chart-container {
      height: 300px;
      width: 100%;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.5rem;
    }

    .clients-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .client-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
    }

    .client-avatar {
      width: 32px;
      height: 32px;
      background: var(--slate-700);
      color: var(--text-primary);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .client-info {
      display: flex;
      flex-direction: column;
    }

    .client-name {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
    }

    .client-email {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    @media (max-width: 1200px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .content-grid { grid-template-columns: 1fr; }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
    }

    .empty-state-icon {
      width: 48px;
      height: 48px;
      color: var(--text-muted);
      margin-bottom: 1rem;
    }

    .empty-state-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .empty-state-description {
      color: var(--text-secondary);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
  `]
})
export class DashboardComponent implements OnInit {
  private clientService = inject(ClientService);
  private factureService = inject(FactureService);

  clients = signal<Client[]>([]);
  factures = signal<Facture[]>([]);

  // Computed Stats
  totalPaidRevenue = computed(() => 
    this.factures().reduce((sum, f) => sum + (f.paidAmount || 0), 0)
  );

  totalFactureRevenue = computed(() => 
    this.factures().reduce((sum, f) => sum + (f.montantTotal || 0), 0)
  );

  pendingInvoicesCount = computed(() => 
    this.factures().filter(f => f.status === 'SENT' || f.status === 'OVERDUE').length
  );

  latestClientsCount = computed(() => {
    // Simulated logic: 20% of clients are new this month
    return Math.ceil(this.clients().length * 0.2);
  });

  // Chart Logic
  public lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Féb', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Revenus (kDH)',
        fill: true,
        tension: 0.4,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#10b981'
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.05)' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.clientService.getAll().subscribe({
      next: (data) => this.clients.set(data),
      error: (err) => console.error('Error loading clients:', err)
    });

    this.factureService.getAll().subscribe({
      next: (data) => {
        this.factures.set(data);
        this.updateChartData(data);
      },
      error: (err) => console.error('Error loading factures:', err)
    });
  }

  updateChartData(factures: Facture[]) {
    // Map last 7 months of revenue
    const monthlyRevenue = new Array(7).fill(0);
    const now = new Date();
    
    factures.forEach(f => {
      const date = new Date(f.dateFacture);
      const monthsDiff = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
      if (monthsDiff >= 0 && monthsDiff < 7) {
        monthlyRevenue[6 - monthsDiff] += (f.montantTotal || 0) / 1000; // in kDH
      }
    });

    this.lineChartData.datasets[0].data = monthlyRevenue;
    
    // Generate labels
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setMonth(now.getMonth() - i);
      labels.push(monthNames[d.getMonth()]);
    }
    this.lineChartData.labels = labels;
  }
}
