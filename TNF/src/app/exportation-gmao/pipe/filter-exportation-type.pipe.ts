import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterExportationType'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterExportationTypePipe implements PipeTransform {

  /**
   * Fonction vérifiant la présence d'un arguments dans la liste des codes d'objet 
   * @param value : Liste des objets
   * @param args : Argument de filtrage
   * @param type : Type de l'objet (Objet repère, item ou sous item)
   * @returns Liste des élement comportant args
   */

  transform(value: any, args: any, type? : any): any {
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
