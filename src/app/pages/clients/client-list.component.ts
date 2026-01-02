import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <!-- ... same template ... -->
    <div class="page fade-in">
      <div class="page-header">
        <div>
          <h1>Clients</h1>
          <p class="text-muted">Gérez votre liste de clients</p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              class="form-control search-input" 
              placeholder="Rechercher un client..." 
              [(ngModel)]="searchQuery">
          </div>
          <a routerLink="/clients/new" class="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 4v16m8-8H4"/>
            </svg>
            Nouveau client
          </a>
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
        } @else if (filteredClients().length === 0) {
          <div class="card-body">
            <div class="empty-state">
              <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <p class="empty-state-title">Aucun client trouvé</p>
              <p class="empty-state-description">Ajustez votre recherche ou ajoutez un nouveau client.</p>
              @if (searchQuery() === '') {
                <a routerLink="/clients/new" class="btn btn-primary">Ajouter un client</a>
              } @else {
                <button (click)="searchQuery.set('')" class="btn btn-secondary">Effacer la recherche</button>
              }
            </div>
          </div>
        } @else {
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (client of filteredClients(); track client.id) {
                  <tr>
                    <td>
                      <div class="client-cell">
                        <div class="client-avatar">{{ client.nom.charAt(0).toUpperCase() }}</div>
                        <span class="client-name">{{ client.nom }}</span>
                      </div>
                    </td>
                    <td>{{ client.email }}</td>
                    <td>{{ client.telephone }}</td>
                    <td class="text-right">
                      <div class="actions">
                        <a [routerLink]="['/clients', client.id, 'edit']" class="btn btn-ghost btn-sm">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                          </svg>
                        </a>
                        <button class="btn btn-ghost btn-sm" (click)="deleteClient(client.id!)">
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
      margin-bottom: var(--spacing-2xl);
    }

    .page-header h1 {
      margin-bottom: var(--spacing-xs);
    }

    .header-actions {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .search-box {
      position: relative;
      min-width: 300px;
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

    .client-cell {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .client-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: var(--primary-100);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-700);
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .client-name {
      font-weight: 600;
      color: var(--text-primary);
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
      .search-box { min-width: 100%; }
      .header-actions { flex-direction: column; align-items: stretch; }
    }
  `]
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);
  private confirmationService = inject(ConfirmationService);
  
  clients = signal<Client[]>([]);
  loading = signal(true);
  searchQuery = signal('');

  filteredClients = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.clients();
    return this.clients().filter(c => 
      c.nom.toLowerCase().includes(query) || 
      c.email.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.loading.set(true);
    this.clientService.getAll().subscribe({
      next: (data) => {
        this.clients.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading clients:', err);
        this.loading.set(false);
      }
    });
  }

  async deleteClient(id: number) {
    const confirmed = await this.confirmationService.confirm({
      title: 'Attention : Suppression définitive',
      message: 'La suppression de ce client entraînera la suppression de TOUTES les factures associées. Cette action est irréversible. Voulez-vous vraiment continuer ?',
      confirmText: 'Tout supprimer',
      type: 'danger'
    });

    if (confirmed) {
      this.clientService.delete(id).subscribe({
        next: () => this.loadClients(),
        error: (err) => console.error('Error deleting client:', err)
      });
    }
  }
}
