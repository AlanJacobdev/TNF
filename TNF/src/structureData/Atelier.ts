export interface AtelierInfo {
    idAtelier: string
    libelleAtelier: string
    actif : boolean;
    isPaste? : boolean
}

export interface Atelier{
    idAtelier : string;
    libelleAtelier : string;
    codeGMAO : string;
    actif : boolean;
    profilCreation : string;
    posteCreation : string;
    dateCreation : Date;
    profilModification : string;
    posteModification : string;
    dateModification : Date;
}