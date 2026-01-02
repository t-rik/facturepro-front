import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page fade-in">
      <div class="page-header">
        <div>
          <h1>{{ isEdit() ? 'Modifier le client' : 'Nouveau client' }}</h1>
          <p class="text-muted">{{ isEdit() ? 'Mettez à jour les informations du client' : 'Ajoutez un nouveau client à votre liste' }}</p>
        </div>
      </div>

      <div class="card form-card">
        <div class="card-body">
          <form (ngSubmit)="onSubmit()">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label" for="nom">Nom complet *</label>
                <input 
                  type="text" 
                  id="nom" 
                  class="form-control" 
                  [(ngModel)]="client.nom" 
                  name="nom" 
                  placeholder="Entrez le nom du client"
                  required>
              </div>

              <div class="form-group">
                <label class="form-label" for="email">Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  class="form-control" 
                  [(ngModel)]="client.email" 
                  name="email" 
                  placeholder="exemple@email.com"
                  required>
              </div>

              <div class="form-group">
                <label class="form-label" for="telephone">Téléphone</label>
                <input 
                  type="tel" 
                  id="telephone" 
                  class="form-control" 
                  [(ngModel)]="client.telephone" 
                  name="telephone" 
                  placeholder="+212 6XX XXX XXX">
              </div>
            </div>

            <div class="form-actions">
              <a routerLink="/clients" class="btn btn-secondary">Annuler</a>
              <button type="submit" class="btn btn-primary" [disabled]="saving()">
                @if (saving()) {
                  <span class="loading">Enregistrement...</span>
                } @else {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ isEdit() ? 'Mettre à jour' : 'Créer le client' }}
                }
              </button>
            </div>
          </form>
        </div>
      </div>
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

    .form-card {
      max-width: 640px;
    }

    .form-grid {
      display: grid;
      gap: var(--spacing-xl);
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-xl);
      border-top: 1px solid var(--border-light);
    }

    @media (max-width: 768px) {
      .page { padding: var(--spacing-lg); }
    }
  `]
})
export class ClientFormComponent implements OnInit {
  private clientService = inject(ClientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  client: Client = { nom: '', email: '', telephone: '' };
  isEdit = signal(false);
  saving = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit.set(true);
      this.clientService.getById(+id).subscribe({
        next: (data) => this.client = data,
        error: (err) => console.error('Error loading client:', err)
      });
    }
  }

  onSubmit() {
    this.saving.set(true);
    
    const operation = this.isEdit()
      ? this.clientService.update(this.client.id!, this.client)
      : this.clientService.create(this.client);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        console.error('Error saving client:', err);
        this.saving.set(false);
      }
    });
  }
}
