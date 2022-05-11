import { Description } from "./Description";

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
    description: Description[]
}

export interface SousItemAffichage {
    idSousItem: string,
    libelleSousItem: string,
    actif: string,
    profilCreation: string,
    dateCreation: string,
    profilModification: string,
    dateModification: string,
    description: Description[]
}

export interface SousItemSave {
    idSousItem : string;
    libelleSousItem: string;
    idItem: string;
    codeSousItem: string;
    securite : boolean;
    estPrefixe: boolean;
    actif: boolean;
    date : string
    profilModification : string;
    posteModification : string;
    description: Description[];
    etat: string;
}

export interface SousItemSuppression {
    idSousItem: string,
    libelleSousItem: string,
    idItem: string,
    codeSousItem: string,
    actif: boolean,
    isPaste? : boolean
}