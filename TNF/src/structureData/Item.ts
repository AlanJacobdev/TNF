import { Description } from "./Description"

export interface ItemInfo {
    idItem: string,
    libelleItem: string,
    idOR: string,
    numeroUnique: string,
    digit: 0,
    codeObjet: string,
    securite: boolean,
    etat: string,
    profilCreation: string,
    posteCreation: string,
    dateCreation: Date,
    profilModification: string,
    posteModification: string,
    dateModification:  Date,
    description: Description[],
    isPaste?: boolean
}

export interface ItemAffichage {
    idItem: string,
    libelleItem: string,
    etat: string,
    profilCreation: string,
    dateCreation: string,
    profilModification: string,
    dateModification:  string,
    description: Description[]
}

export interface ItemEtDispo{
    idItem: string,
    libelle: string
}

export enum typeObjet {
    OR = "OR",
    Item = "Item",
    SI = "SI",
    Aucun = "Aucun"
}

export enum etat {
    EA = "EA",
    A = "A",
    HS = "HS",
    Aucun = "Aucun"
}

export interface ItemModification {
    idItem: string,
    libelleItem: string,
    etat: string,
    description: Description[]

}

export interface ItemSave {
    idItem : string,
    libelleItem : string,
    idOR : string,
    numeroUnique : string,
    digit : number,
    codeObjet : string,
    securite : boolean,
    etat : string,
    date : string,
    profilModification : string,
    posteModification : string,
    description : Description[],
    status : string
}

export interface ItemRecopie {
    idItem: string,
    libelleItem: string,
    idOR: string,
    codeObjet: string,
    etat: string,
    isPaste : boolean
}

export interface ItemSuppresion {
    idItem: string,
    libelleItem: string,
    idOR: string,
    codeObjet: string,
    etat: string,
    isPaste? : boolean
}