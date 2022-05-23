import { Description } from "./Description";

export interface SousItemInfo {
    idSousItem: string,
    libelleSousItem: string,
    idItem: string,
    codeSousItem: string,
    securite: boolean,
    estPrefixe: boolean,
    etat: string,
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
    etat: string,
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
    etat: string;
    date : string
    profilModification : string;
    posteModification : string;
    description: Description[];
    status: string;
}

export interface SousItemSuppression {
    idSousItem: string,
    libelleSousItem: string,
    idItem: string,
    codeSousItem: string,
    etat: string,
    isPaste? : boolean
}