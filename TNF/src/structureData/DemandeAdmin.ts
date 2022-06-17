import { ItemAffichage, ItemEtDispo } from "./Item"
import { ObjetRepereAffichage, ObjetRepereUtile } from "./ObjetRepere"
import { SousItemAffichage, SousItemEtDispo } from "./SousItem"

export interface DemandeAdmin {
    idDemande : number,
    motif : string,
    etat : boolean,
    idDelete : boolean,
    profilCreation : string,
    dateCreation : Date,
    profilModification : string,
    dateModification : Date
}

export enum typeTableauDemande {
    A = "Actuel",
    T = "Traite",
    Aucun = "Aucun"
  }

export interface DemandeAdminInfo {
  idDemande: number,
  motif: string,
  etat: boolean,
  isDelete: boolean,
  profilCreation: string,
  dateCreation: Date,
  profilModification: string,
  dateModification: Date ,
  itemDelete: ItemAffichage[],
  sousItemDelete: SousItemAffichage[],
  orDelete: ObjetRepereAffichage[]
}

export interface ArborescenceOR {
  OR : ObjetRepereUtile, 
  Item: ArborescenceItem[]
}

export interface ArborescenceItem {
  Item: ItemEtDispo,
  SI: SousItemEtDispo[],
}

export interface etatCaretItem {
  idItem: string ,
  etat: boolean
}