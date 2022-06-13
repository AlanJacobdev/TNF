export interface deleteObject {
    listeOR : string[],
    listeItem : string[],
    listeSI : string[]
}

export interface returnDeleteObject {
    listeOR : returnSuppression[],
    listeItem : returnSuppression[],
    listeSI : returnSuppression[]
}

export interface returnSuppression {
    objet : string,
    value : boolean
}

export interface demandeAdmin {
    motif : string;
    orDelete : Objetrepere[];
    itemDelete : Item[];
    sousItemDelete : Sousitem[];
    profilCreation : string;
}

export interface Objetrepere{
    idObjetRepere : string;
}

export interface Item{
    idItem : string;
}

export interface Sousitem{
    idSousItem : string;
}
