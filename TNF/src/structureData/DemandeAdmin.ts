import { ItemAffichage } from "./Item"
import { ObjetRepereAffichage } from "./ObjetRepere"
import { SousItemAffichage } from "./SousItem"

export interface DemandeAdmin {
    idDemande : number,
    motif : string,
    etat : boolean,
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
    profilCreation: string,
    dateCreation: Date,
    profilModification: string,
    dateModification: Date ,
    itemDelete: ItemAffichage[],
    sousItemDelete: SousItemAffichage[],
    orDelete: ObjetRepereAffichage[]
}