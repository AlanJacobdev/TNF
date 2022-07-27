export interface InformationInfo {
    idInfo : number
    titre : string
    text : string
    document : DocumentInfo[];
    profilCreation : string
    dateCreation : Date
    profilModification : string
    dateModification : Date
}
export interface InformationCreate {
    titre : string
    text : string
    idDocument : number[];
    profilCreation : string
}

export interface ModificationInfo {
    modify : boolean
}


export interface DocumentInfo {
    idDoc : number
    idDocument : string
    nomDocument : string
    path : string
    date : Date
    profil : string,
    type : string,
    edited : boolean;
}

export interface InformationModify {
    text : string
    idDocument : number[];
    profilModification : string
    
}

// export interface documentInfoModify{
//     id : number;
//     nom : string
// }