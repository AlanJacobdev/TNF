export interface utilisateur {
    nom : string,
    prenom : string
}

export interface UtilisateurInfo {
    idUtilisateur: number;
    nom : string;
    prenom : string;
    login : string;
    email : string;
    idRole : number;
    estActif : boolean;
    estAdministrateur : boolean;
    profilCreation : string;
    posteCreation : string;
    dateCreation : Date;
    profilModification : string;
    posteModification : string;
    dateModification : Date;
}