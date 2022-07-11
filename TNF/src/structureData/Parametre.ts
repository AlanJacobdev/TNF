export interface ParamInfo {
    libelle: string,
    valeur: string,
    profilCreation: string,
    posteCreation: string,
    dateCreation: Date,
    profilModification: string,
    posteModification: string,
    dateModification: Date
}


export interface ParamEdit {
    valeur: string,
    profilModification: string,
    posteModification: string,
    dateModification: Date
}