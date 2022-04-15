export interface SousItemInfo {
    idSousItem: string,
    libelleSousItem: string,
    idItem: string,
    codeSousItem: string,
    securite: boolean,
    estPrefixe: boolean,
    actif: boolean,
    profilCreation: string,
    posteCreation: string,
    dateCreation: Date,
    profilModification: string,
    posteModification: string,
    dateModification: Date,
    description: string
}

export interface SousItemAffichage {
    idSousItem: string,
    libelleSousItem: string,
    actif: string,
    profilCreation: string,
    dateCreation: string,
    profilModification: string,
    dateModification: string,
    description: string
}

export interface SousItemSave {
    idSousItem : string;
    libelleSousItem: string;
    idItem: string;
    codeSousItem: string;
    securite : boolean;
    estPrefixe: boolean;
    actif: boolean;
    date : Date
    profilModification : string;
    posteModification : string;
    description: string;
    etat: string;
}