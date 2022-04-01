export interface TypeObjetInfo {
    idType : string,
    libelleType : string,
    profilCreation : string,
    posteCreation : string,
    dateCreation : string,
    profilModification : string,
    posteModification : string,
    dateModification : string
}

export interface TypeObjetRepereInfo {
    idTypeOR : string,
    libelleTypeOR : string,
    profilCreation : string,
    posteCreation : string,
    dateCreation : string,
    profilModification : string,
    posteModification : string,
    dateModification : string
}

export enum createTypeObject {
    OR = "OR",
    O = "O"
}

export interface modificationTypeObject{
    idTypeObjet : string,
    libelleTypeObjet : string,
}