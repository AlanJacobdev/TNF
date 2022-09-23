import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterExportationAtelier'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterExportationAtelierPipe implements PipeTransform {

    /**
   * Fonction vérifiant la présence d'un argument dans les numéro unique
   * @param value : Liste des objets
   * @param args : Argument de filtrage
   * @param type : Type d'objet (Objet repère, item ou sous item)
   * @returns Liste des élement comportant args

   */
  transform(value: any, args: string, type? : any): any {
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();
    if(type != null) {
      if(type =='OR'){
        return value.filter(function(item: any) {
          return item.numeroUnique.toLowerCase().charAt(0) === args;    
        });
      } else if (type == 'Item') {
        return value.filter(function(item: any) {
          return item.numeroUnique.toLowerCase().charAt(0) === args; 
        });
      } else {
        return value.filter(function(item: any) {
            return item.idItem.toLowerCase().charAt(2) === args;
        });  
      }
      
    }
  }

}
