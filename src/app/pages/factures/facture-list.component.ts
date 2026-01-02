import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FactureService } from '../../services/facture.service';
import { Facture, FactureStatus } from '../../models/facture.model';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-facture-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- ... same template ... -->
    <div class="page fade-in">
      <div class="page-header">
        <div>
          <h1>Factures</h1>
          <p class="text-muted">Gérez vos factures et suivez vos paiements</p>
        </div>
        <a routerLink="/factures/new" class="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 4v16m8-8H4"/>
          </svg>
          Nouvelle facture
        </a>
      </div>

      <!-- Search and Filter Bar -->
      <div class="filters-bar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            class="form-control search-input" 
            placeholder="Rechercher par client ou numéro..." 
            [(ngModel)]="searchQuery">
        </div>
        <div class="filter-group">
          <select class="form-control" [(ngModel)]="statusFilter">
            <option value="">Tous les statuts</option>
            <option value="DRAFT">Brouillon</option>
            <option value="SENT">Envoyée</option>
            <option value="PAID">Payée</option>
            <option value="OVERDUE">En retard</option>
          </select>
        </div>
      </div>

      <div class="card">
        @if (loading()) {
          <div class="card-body">
            <div class="loading-placeholder">
              <div class="skeleton skeleton-row"></div>
              <div class="skeleton skeleton-row"></div>
              <div class="skeleton skeleton-row"></div>
            </div>
          </div>
        } @else if (filteredFactures().length === 0) {
          <div class="card-body">
            <div class="empty-state">
              <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <p class="empty-state-title">Aucune facture trouvée</p>
              <p class="empty-state-description">
                @if (searchQuery() || statusFilter()) {
                  Ajustez vos filtres ou créez une nouvelle facture.
                } @else {
                  Créez votre première facture pour commencer.
                }
              </p>
              @if (searchQuery() || statusFilter()) {
                <button (click)="clearFilters()" class="btn btn-secondary">Effacer les filtres</button>
              } @else {
                <a routerLink="/factures/new" class="btn btn-primary">Créer une facture</a>
              }
            </div>
          </div>
        } @else {
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Numéro</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th class="text-right">Montant</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (facture of filteredFactures(); track facture.id) {
                  <tr>
                    <td><span class="badge badge-info">#{{ facture.id }}</span></td>
                    <td>
                      <div class="client-cell">
                        <div class="client-avatar">{{ (facture.client?.nom || 'N').charAt(0).toUpperCase() }}</div>
                        <span>{{ facture.client?.nom || 'N/A' }}</span>
                      </div>
                    </td>
                    <td>{{ facture.dateFacture | date:'dd/MM/yyyy' }}</td>
                    <td>
                      <span class="badge" [ngClass]="getStatusClass(facture.status)">
                        {{ getStatusLabel(facture.status) }}
                      </span>
                    </td>
                    <td class="text-right">
                      <div class="amount-cell">
                        <strong class="amount">{{ facture.montantTotal | number:'1.2-2' }} DH</strong>
                        @if ((facture.paidAmount || 0) > 0 && facture.status !== 'PAID') {
                          <small class="paid-info">Payé: {{ facture.paidAmount | number:'1.2-2' }} DH</small>
                        }
                      </div>
                    </td>
                    <td class="text-right">
                      <div class="actions">
                        <button class="btn btn-ghost btn-sm" (click)="downloadPdf(facture.id!)" title="Télécharger PDF">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                        </button>
                        <a [routerLink]="['/factures', facture.id, 'edit']" class="btn btn-ghost btn-sm" title="Modifier">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </a>
                        <button class="btn btn-ghost btn-sm" (click)="deleteFacture(facture.id!)" title="Supprimer">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .page {
      padding: var(--spacing-xl) var(--spacing-2xl);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
    }

    .page-header h1 {
      margin-bottom: var(--spacing-xs);
    }

    .filters-bar {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
      flex-wrap: wrap;
    }

    .search-box {
      position: relative;
      min-width: 300px;
      flex: 1;
    }

    .search-input {
      padding-left: 2.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
    }

    .search-input:focus {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-muted);
      pointer-events: none;
    }

    .filter-group select {
      min-width: 180px;
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      color: var(--text-primary);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
    }

    .client-cell {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .client-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: var(--primary-100);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-700);
      font-weight: 700;
      font-size: 0.8125rem;
      flex-shrink: 0;
    }

    .amount-cell {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .amount {
      color: var(--success);
      font-weight: 600;
    }

    .paid-info {
      color: var(--text-muted);
      font-size: 0.75rem;
    }

    .badge-draft {
      background: rgba(148, 163, 184, 0.1);
      color: var(--slate-400);
    }

    .badge-sent {
      background: rgba(59, 130, 246, 0.1);
      color: var(--primary-500);
    }

    .badge-paid {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success);
    }

    .badge-overdue {
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger);
    }

    .actions {
      display: flex;
      gap: var(--spacing-xs);
      justify-content: flex-end;
    }

    .loading-placeholder {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .skeleton {
      background: linear-gradient(90deg, var(--slate-800) 25%, var(--slate-700) 50%, var(--slate-800) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-md);
    }

    .skeleton-row {
      height: 56px;
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state-icon {
      width: 64px;
      height: 64px;
      color: var(--slate-300);
      margin-bottom: 1.5rem;
    }

    .empty-state-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .empty-state-description {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      max-width: 400px;
    }

    @media (max-width: 768px) {
      .page { padding: var(--spacing-lg); }
      .filters-bar { flex-direction: column; }
      .search-box { min-width: 100%; }
      }
    }
  `]
})
export class FactureListComponent implements OnInit {
  private factureService = inject(FactureService);
  private confirmationService = inject(ConfirmationService);
  
  factures = signal<Facture[]>([]);
  loading = signal(true);
  searchQuery = signal('');
  statusFilter = signal<FactureStatus | ''>('');

  filteredFactures = computed(() => {
    let result = this.factures();
    
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(f => 
        f.client?.nom?.toLowerCase().includes(query) || 
        f.id?.toString().includes(query)
      );
    }

    const status = this.statusFilter();
    if (status) {
      result = result.filter(f => f.status === status);
    }

    return result;
  });

  ngOnInit() {
    this.loadFactures();
  }

  loadFactures() {
    this.loading.set(true);
    this.factureService.getAll().subscribe({
      next: (data) => {
        this.factures.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading factures:', err);
        this.loading.set(false);
      }
    });
  }

  async deleteFacture(id: number) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Supprimer la facture',
      message: 'Êtes-vous sûr de vouloir supprimer cette facture ?',
      confirmText: 'Supprimer',
      type: 'danger'
    });

    if (confirmed) {
      this.factureService.delete(id).subscribe({
        next: () => this.loadFactures(),
        error: (err) => console.error('Error deleting facture:', err)
      });
    }
  }

  downloadPdf(id: number) {
    this.factureService.downloadPdf(id);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.statusFilter.set('');
  }

  getStatusClass(status?: FactureStatus): string {
    switch (status) {
      case 'DRAFT': return 'badge-draft';
      case 'SENT': return 'badge-sent';
      case 'PAID': return 'badge-paid';
      case 'OVERDUE': return 'badge-overdue';
      default: return 'badge-draft';
    }
  }

  getStatusLabel(status?: FactureStatus): string {
    switch (status) {
      case 'DRAFT': return 'Brouillon';
      case 'SENT': return 'Envoyée';
      case 'PAID': return 'Payée';
      case 'OVERDUE': return 'En retard';
      default: return 'Brouillon';
    }
  }
}
