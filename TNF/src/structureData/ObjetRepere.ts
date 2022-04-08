export interface ObjetRepereInfo {
    idObjetRepere: string,
    libelleObjetRepere: string,
    codeType: string,
    numeroUnique: string,
    valide: boolean,
    profilCreation: string,
    posteCreation: string,
    dateCreation: Date,
    profilModification: string,
    posteModification: string,
    dateModification: Date,
    description: string
}

export interface ObjetRepereAffichage {
    idObjetRepere: string,
    libelleObjetRepere: string,
    valide: string,
    profilCreation: string,
    dateCreation: string,
    profilModification: string,
    dateModification: string,
    description: string
}

export interface NUetOR {
    numeroUnique: string,
    libelleOR: string
}

export interface ObjetRepereModification {
    idObjetRepere: string,
    libelleObjetRepere: string,
    valide: boolean,
    description: string
}