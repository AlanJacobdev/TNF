import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterType'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterTypePipe implements PipeTransform {

  /**
   * Fonction vérifiant la présence d'un élement dans la liste des objets 
   * @param value : Liste des objets
   * @param args : Argument de filtrage (code objet)
   * @param type : Type d'objet (objet repère, item ou sous item)
   * @returns Liste des élement comportant args
   */
  transform(value: any, args?: any, type? : any): any {
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();
    if(type != null) {
      if(type =='OR'){
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeType)
            .toLowerCase()
            .includes(args);
        });
      } else if (type == 'Item') {
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeObjet)
            .toLowerCase()
            .includes(args);
        });
      } else {
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeSousItem)
            .toLowerCase()
            .includes(args);
        });
      }
      
    }
  }

}
