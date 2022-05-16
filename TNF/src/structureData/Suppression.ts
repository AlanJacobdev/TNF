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