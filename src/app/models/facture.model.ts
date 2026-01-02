export type FactureStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';

export interface LigneFacture {
  id?: number;
  designation: string;
  quantite: number;
  prixUnitaire: number;
}

export interface Facture {
  id?: number;
  dateFacture: Date | string;
  montantTotal: number;
  paidAmount?: number;
  status?: FactureStatus;
  clientId?: number;
  client?: {
    id: number;
    nom: string;
    email: string;
    telephone: string;
  };
  lignes: LigneFacture[];
}
