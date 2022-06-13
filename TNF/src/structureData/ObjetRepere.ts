import { Description } from "./Description"

export interface ObjetRepereInfo {
    idObjetRepere: string,
    libelleObjetRepere: string,
    codeType: string,
    numeroUnique: string,
    valide: string,
    profilCreation: string,
    posteCreation: string,
    dateCreation: Date,
    profilModification: string,
    posteModification: string,
    dateModification: Date,
    description: Description[] 
}

export interface ObjetRepereAffichage {
    idObjetRepere: string,
    libelleObjetRepere: string,
    valide: string,
    profilCreation: string,
    dateCreation: string,
    profilModification: string,
    dateModification: string,
    description: Description[]
}

export interface NUetOR {
    numeroUnique: string,
    libelleOR: string
}

export interface ObjetRepereModification {
    idObjetRepere: string,
    libelleObjetRepere: string,
    valide: string,
    description: Description[]
}

export interface ObjetRepereSave {
    idObjetRepere : string,
    libelleObjetRepere  : string,
    codeType : string,
    numeroUnique : string,
    valide : string,
    description: Description[],
    etat : string,
    date : string,
    profilModification : string,
    posteModification : string
}

export interface ObjetRepereUtile{
    idObjetRepere : string,
    libelleObjetRepere  : string
}

export interface ObjetRepereSuppression {
    idObjetRepere: string,
    libelleObjetRepere: string,
    codeType: string,
    valide: string,
    isPaste? : boolean
}

export enum valide {
    A = "A",
    R = "R",
    Aucun = "Aucun"
}