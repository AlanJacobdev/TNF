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


export interface DocumentInfo {
    idDoc : number
    idDocument : string
    nomDocument : string
    libelleDocument : string
    path : string
    date : Date
    profil : string,
    type : string,
    edited : boolean;
    editedLibelle : boolean;
}

export interface InformationModify {
    text : string
    idDocument : number[];
    profilModification : string
    
}

export interface documentInfoModify{
    idDocument : number
    libelleDocument : string
}


export interface DocumentReceive {
    idDoc : number
    idDocument : string
    nomDocument : string
    type : string
    path : string
    date : Date
    profil : string
}

export interface DocName{
    originalName : string,
    nameDisplay : string,
}