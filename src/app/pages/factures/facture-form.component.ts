import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FactureService } from '../../services/facture.service';
import { ClientService } from '../../services/client.service';
import { Facture, LigneFacture, FactureStatus } from '../../models/facture.model';
import { Client } from '../../models/client.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-facture-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page fade-in">
      <div class="page-header">
        <div>
          <h1>{{ isEditMode() ? 'Modifier la facture' : 'Nouvelle facture' }}</h1>
          <p class="text-muted">{{ isEditMode() ? 'Modifiez les détails de la facture' : 'Créez une nouvelle facture pour votre client' }}</p>
        </div>
      </div>

      <form (ngSubmit)="onSubmit()" class="facture-form">
        <!-- Client Selection -->
        <div class="card">
          <div class="card-header">
            <h3>Informations client</h3>
          </div>
          <div class="card-body">
            <div class="form-row">
              <div class="form-group flex-2">
                <label class="form-label" for="client">Sélectionner un client *</label>
                <select 
                  id="client" 
                  class="form-control" 
                  [(ngModel)]="selectedClientId" 
                  name="client" 
                  required
                  [disabled]="isEditMode()">
                  <option value="">-- Choisir un client --</option>
                  @for (client of clients(); track client.id) {
                    <option [value]="client.id">{{ client.nom }} - {{ client.email }}</option>
                  }
                </select>
              </div>
              @if (isEditMode()) {
                <div class="form-group flex-1">
                  <label class="form-label" for="status">Statut</label>
                  <select 
                    id="status" 
                    class="form-control" 
                    [(ngModel)]="selectedStatus" 
                    name="status">
                    <option value="DRAFT">Brouillon</option>
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="OVERDUE">En retard</option>
                  </select>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Invoice Lines -->
        <div class="card">
          <div class="card-header">
            <h3>Articles / Services</h3>
            <button type="button" class="btn btn-secondary btn-sm" (click)="addLine()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 4v16m8-8H4"/>
              </svg>
              Ajouter une ligne
            </button>
          </div>
          <div class="card-body">
            @if (lignes().length === 0) {
              <div class="empty-lines">
                <p>Aucun article ajouté. Cliquez sur "Ajouter une ligne" pour commencer.</p>
              </div>
            } @else {
              <div class="lines-table">
                <div class="lines-header">
                  <span class="col-designation">Désignation</span>
                  <span class="col-qty">Quantité</span>
                  <span class="col-price">Prix unitaire (DH)</span>
                  <span class="col-total">Total</span>
                  <span class="col-action"></span>
                </div>
                @for (ligne of lignes(); track $index; let i = $index) {
                  <div class="line-row">
                    <input 
                      type="text" 
                      class="form-control col-designation" 
                      [(ngModel)]="ligne.designation" 
                      [name]="'designation-' + i"
                      placeholder="Description de l'article"
                      required>
                    <input 
                      type="number" 
                      class="form-control col-qty" 
                      [(ngModel)]="ligne.quantite" 
                      [name]="'quantite-' + i"
                      (ngModelChange)="calculateTotal()"
                      min="1"
                      required>
                    <input 
                      type="number" 
                      class="form-control col-price" 
                      [(ngModel)]="ligne.prixUnitaire" 
                      [name]="'prix-' + i"
                      (ngModelChange)="calculateTotal()"
                      min="0"
                      step="0.01"
                      required>
                    <span class="col-total line-total">{{ (ligne.quantite * ligne.prixUnitaire) | number:'1.2-2' }} DH</span>
                    <button type="button" class="btn btn-ghost btn-sm col-action" (click)="removeLine(i)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                }
              </div>
            }
          </div>
          <div class="card-footer">
            <div class="total-section">
              <span class="total-label">Total HT</span>
              <span class="total-value">{{ montantTotal() | number:'1.2-2' }} DH</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <a routerLink="/factures" class="btn btn-secondary">Annuler</a>
          <button type="submit" class="btn btn-primary" [disabled]="saving() || lignes().length === 0">
            @if (saving()) {
              <span class="loading">{{ isEditMode() ? 'Mise à jour...' : 'Création...' }}</span>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 13l4 4L19 7"/>
              </svg>
              {{ isEditMode() ? 'Mettre à jour' : 'Créer la facture' }}
            }
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .page {
      padding: var(--spacing-xl) var(--spacing-2xl);
    }

    .page-header {
      margin-bottom: var(--spacing-2xl);
    }

    .page-header h1 {
      margin-bottom: var(--spacing-xs);
    }

    .facture-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      max-width: 1000px;
    }

    .card-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .form-row {
      display: flex;
      gap: var(--spacing-xl);
    }

    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }

    .empty-lines {
      text-align: center;
      padding: var(--spacing-2xl);
      color: var(--text-muted);
      background: rgba(255, 255, 255, 0.02);
      border-radius: var(--radius-lg);
      border: 1px dashed var(--border-light);
    }

    .lines-table {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .lines-header {
      display: grid;
      grid-template-columns: 2fr 100px 150px 120px 40px;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) 0;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .line-row {
      display: grid;
      grid-template-columns: 2fr 100px 150px 120px 40px;
      gap: var(--spacing-md);
      align-items: center;
      padding: var(--spacing-sm);
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
    }

    .line-row:hover {
      border-color: var(--primary-500);
      background: var(--bg-surface);
    }

    .line-total {
      font-weight: 700;
      color: var(--text-primary);
      text-align: right;
    }

    .total-section {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: var(--spacing-xl);
      padding-top: var(--spacing-md);
    }

    .total-label {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .total-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--success);
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      padding-top: var(--spacing-lg);
    }

    select option {
      background: var(--bg-surface);
      color: var(--text-primary);
    }

    @media (max-width: 768px) {
      .page { padding: var(--spacing-lg); }
      
      .form-row {
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .lines-header { display: none; }

      .line-row {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
      }

      .col-qty, .col-price { width: 100%; }
      .line-total { text-align: left; }
      .col-action { width: auto; justify-self: start; }
    }
  `]
})
export class FactureFormComponent implements OnInit {
  private factureService = inject(FactureService);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  clients = signal<Client[]>([]);
  lignes = signal<LigneFacture[]>([]);
  montantTotal = signal(0);
  selectedClientId = '';
  selectedStatus: FactureStatus = 'DRAFT';
  saving = signal(false);
  isEditMode = signal(false);
  factureId: number | null = null;

  ngOnInit() {
    this.loadClients();
    
    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.factureId = +id;
      this.isEditMode.set(true);
      this.loadFacture(this.factureId);
    }
  }

  loadClients() {
    this.clientService.getAll().subscribe({
      next: (data) => this.clients.set(data),
      error: (err) => console.error('Error loading clients:', err)
    });
  }

  loadFacture(id: number) {
    this.factureService.getById(id).subscribe({
      next: (facture) => {
        this.selectedClientId = facture.client?.id?.toString() || '';
        this.selectedStatus = facture.status || 'DRAFT';
        this.lignes.set(facture.lignes || []);
        this.calculateTotal();
      },
      error: (err) => {
        console.error('Error loading facture:', err);
        this.toastService.error('Erreur lors du chargement de la facture');
        this.router.navigate(['/factures']);
      }
    });
  }

  addLine() {
    this.lignes.update(lines => [...lines, { designation: '', quantite: 1, prixUnitaire: 0 }]);
  }

  removeLine(index: number) {
    this.lignes.update(lines => lines.filter((_, i) => i !== index));
    this.calculateTotal();
  }

  calculateTotal() {
    const total = this.lignes().reduce((sum, l) => sum + (l.quantite * l.prixUnitaire), 0);
    this.montantTotal.set(total);
  }

  onSubmit() {
    if (!this.selectedClientId || this.lignes().length === 0) return;

    this.saving.set(true);

    const facture: Facture = {
      dateFacture: new Date().toISOString(),
      montantTotal: this.montantTotal(),
      status: this.selectedStatus,
      client: { id: +this.selectedClientId } as any,
      lignes: this.lignes()
    };

    if (this.isEditMode() && this.factureId) {
      this.factureService.update(this.factureId, facture).subscribe({
        next: () => {
          this.toastService.success('Facture mise à jour avec succès');
          this.router.navigate(['/factures']);
        },
        error: (err) => {
          console.error('Error updating facture:', err);
          this.toastService.error('Erreur lors de la mise à jour');
          this.saving.set(false);
        }
      });
    } else {
      this.factureService.create(facture).subscribe({
        next: () => {
          this.toastService.success('Facture créée avec succès');
          this.router.navigate(['/factures']);
        },
        error: (err) => {
          console.error('Error creating facture:', err);
          this.toastService.error('Erreur lors de la création');
          this.saving.set(false);
        }
      });
    }
  }
}
