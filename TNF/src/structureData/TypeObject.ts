export interface TypeObjetInfo {
    idType : string,
    libelleType : string,
    profilCreation : string,
    posteCreation : string,
    dateCreation : string,
    profilModification : string,
    posteModification : string,
    dateModification : string,
    actif : boolean
}

export interface TypeObjetRepereInfo {
    idTypeOR : string,
    libelleTypeOR : string,
    profilCreation : string,
    posteCreation : string,
    dateCreation : string,
    profilModification : string,
    posteModification : string,
    dateModification : string,
    actif : boolean,
    isPaste? : boolean
}

export interface TypeObjetRepereTableau {
    idType : string,
    libelleTypeOR : string,
    profilCreation : string,
    posteCreation : string,
    dateCreation : string,
    profilModification : string,
    posteModification : string,
    dateModification : string,
    actif : boolean
}


export enum createTypeObject {
  OR = "OR",
  O = "O",
  Aucun = "Aucun"
}

export interface modificationTypeObject{
    idTypeObjet : string,
    libelleTypeObjet : string,
    actif : boolean
}

export interface TypeObjet {
    idtypeobjet : string,
}

export interface TypeObjetRepere {
    idtypeobjet : string
}