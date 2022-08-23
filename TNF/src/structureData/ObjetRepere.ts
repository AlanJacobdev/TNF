import { Description } from "./Description"
import {  ItemInfo } from "./Item"
import {  SousItemInfo } from "./SousItem"

export interface ObjetRepereInfo {
    idObjetRepere: string,
    libelleObjetRepere: string,
    codeType: string,
    numeroUnique: string,
    etat: string,
    profilCreation: string,
    posteCreation: string,
    dateCreation: Date,
    profilModification: string,
    posteModification: string,
    dateModification: Date,
    description: Description[],
    isPaste? : boolean,
    securite : boolean
}

export interface ObjetRepereAffichage {
    idObjetRepere: string,
    libelleObjetRepere: string,
    etat: string,
    profilCreation: string,
    dateCreation: string,
    profilModification: string,
    dateModification: string,
    description: Description[],
    securite : boolean
}

export interface NUetOR {
    numeroUnique: string,
    libelleOR: string
}

export interface ObjetRepereModification {
    idObjetRepere: string,
    libelleObjetRepere: string,
    etat: string,
    description: Description[]
}

export interface ObjetRepereSave {
    idObjetRepere : string,
    libelleObjetRepere  : string,
    codeType : string,
    numeroUnique : string,
    etat : string,
    description: Description[],
    status : string,
    date : string,
    profilModification : string,
    posteModification : string,
    securite : boolean
}

export interface ObjetRepereUtile{
    idObjetRepere : string,
    libelleObjetRepere  : string
}

export interface infoORBeingChanged{
    id : string,
    login  : string
    profil : string
}

export interface ObjetRepereSuppression {
    idObjetRepere: string,
    libelleObjetRepere: string,
    codeType: string,
    etat: string,
    isPaste? : boolean,
    
}

export enum valide {
    A = "A",
    R = "R",
    Aucun = "Aucun"
}

export interface ObjectToExportGmao {
    listeOR : ObjetRepereInfo[],
    listeItem : ItemInfo[],
    listeSI : SousItemInfo[]
}

export interface exportGMAO{
    createObject :  {
                    listeOR : ObjetRepereInfo[],
                    listeItem : ItemInfo[],
                    listeSI : SousItemInfo[],
                    },
    updateObject :  {
                    listeOR : ObjetRepereInfo[],
                    listeItem : ItemInfo[],
                    listeSI : SousItemInfo[],
                    },
    user : string,
    nomDocument :string
}