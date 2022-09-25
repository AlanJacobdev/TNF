import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterModification'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterModificationPipe implements PipeTransform {

  /**
   * Fonction vérifiant la présence d'un élement dans la liste des objets 
   * @param value : Liste des objets
   * @param args : Argument de filtrage (identifiant)
   * @param type : Type d'objet (objet repère, item ou sous item)
   * @returns Liste des élement comportant args
   */
  transform(value: any, args?: any,  type? : any): any {
    if (!value) return null;
    if (!args) return value;
    if(type =='OR' || type =='ItemOR' || type == 'SIOR'){
      return value.filter(function(item: any) {
        return JSON.stringify(item.idObjetRepere)
          .toUpperCase()
          .includes(args);
      });
    } else if (type == 'Item' || type == 'SIItem') {
      return value.filter(function(item: any) {
        return JSON.stringify(item.idItem)
          .toUpperCase()
          .includes(args);
      });
    } else {
      return value.filter(function(item: any) {
        return JSON.stringify(item.idSousItem)
          .toUpperCase()
          .includes(args);
      });
    }
  }
}
