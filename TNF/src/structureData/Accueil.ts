import { Description } from "./Description";

export interface infoPerMonth {
    date : string;
    count : number
}

export interface typeInfoPerMounth {
    objectCreated : infoPerMonth[],
    objectModified : infoPerMonth[],
    objectDeleted : infoPerMonth[]
}

export interface typeInfoPerDay {
    objectCreated : infoPerDay[],
    objectModified : infoPerDayModified[],
    objectDeleted : infoPerDayDelete[]
}

export interface allActivity {
    id : string,
    libelle: string,
    newlibelle?: string,
    etat: string,
    newEtat?: string
    profil : string
    date : Date,
    description: Description[],
    newDescription? : Description[],
    typeObjet : string,
    typeActivity : typeActivity
}


export interface infoPerDay {
    id : string,
    libelle: string,
    etat: string,
    profilCreation : string
    dateCreation : Date,
    description : Description[],
    typeObjet : string
}

export interface infoPerDayModified {
    id : string,
    libelle: string,
    newlibelle: string,
    etat: string,
    newEtat: string
    profilModification : string
    dateModification : Date,
    description: Description[],
    newDescription : Description[],
    typeObjet : string
}

export interface infoPerDayDelete {
    id : string,
    libelle: string,
    etat: string,
    profilSuppression : string
    dateSuppression : Date,
    description: Description[],
    typeObjet : string
}

export interface infoForDescription {
    id : string,
    libelle: string,
    description: Description[],
    newDescription?: Description[],
    typeObjet : string
}

export enum typeActivity {
    All = "All",
    Create = "ItCreateem",
    Edit = "Edit",
    Delete = "Delete"
}


