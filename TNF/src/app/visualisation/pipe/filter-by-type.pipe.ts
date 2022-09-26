import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByType'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterByTypePipe implements PipeTransform {

    /**
   * Fonction vérifiant la présence d'un élement dans la liste des objets 
   * @param value : Liste des objets
   * @param args : Argument de filtrage (code objet)
   * @param type : Type d'objet (objet repère, item ou sous item)
   * @returns Liste des élement comportant args
   */
  transform(value: any, args?: any, type?: any): any {
    if (!value) return null;
    if (!args) return value;
    

    
    if(type != null) {
      if(type =='OR'){
        if(args == "-1") return value; 
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeType)
            .includes(args);
        });
      } else if (type == 'Item') {
        if(args == "-1") return value; 
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeObjet)
            .includes(args);
        });
      } else {
        if(args == "-1") return value; 
        return value.filter(function(item: any) {
          return JSON.stringify(item.codeSousItem)
            .includes(args);
        });
      }

    }
  }

}
