import { Atelier } from "./Atelier"
import { TypeObjetRepereInfo } from "./TypeObject"

export interface roleInfo {
    idRole : number
    libelleRole : string
    dateCreation : Date
    profilCreation : string
    dateModification : Date
    profilModification : string
    atelier : Atelier[];
    typeObjet : TypeObjetRepereInfo[];
}