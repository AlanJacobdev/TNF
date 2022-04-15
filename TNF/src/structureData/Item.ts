export interface ItemInfo {
    idItem: string,
    libelleItem: string,
    idOR: string,
    numeroUnique: string,
    digit: 0,
    codeObjet: string,
    securite: boolean,
    actif: boolean,
    profilCreation: string,
    posteCreation: string,
    dateCreation: Date,
    profilModification: string,
    posteModification: string,
    dateModification:  Date,
    description: string
}

export interface ItemAffichage {
    idItem: string,
    libelleItem: string,
    actif: string,
    profilCreation: string,
    dateCreation: string,
    profilModification: string,
    dateModification:  string,
    description: string
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

export interface ItemModification {
    idItem: string,
    libelleItem: string,
    valide: boolean,
    description: string

}

export interface ItemSave {
    idItem : string,
    libelleItem : string,
    idOR : string,
    numeroUnique : string,
    digit : number,
    codeObjet : string,
    securite : boolean,
    actif : boolean,
    date : string,
    profilModification : string,
    posteModification : string,
    description : string,
    etat : string
}

export interface ItemRecopie {
    idItem: string,
    libelleItem: string,
    idOR: string,
    codeObjet: string,
    actif: boolean,
    isPaste : boolean
}