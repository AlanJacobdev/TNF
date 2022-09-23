import { Pipe, PipeTransform } from '@angular/core';
import { etatExport } from 'src/structureData/Item';

@Pipe({
  name: 'filterExportationEtat'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterExportationEtatPipe implements PipeTransform {

  /**
   * Fonction vérifiant l'état d'un objet
   * @param value : Liste des objets
   * @param args : Argument de filtrage
   * @returns Liste des élement comportant args
   */
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    return value.filter(function(item: any) {
      if( args == etatExport.C) {
        return (item.dateModification == null);
      } else if(args == etatExport.M) {
        return (item.dateModification != null)
      } else {
        return value;
      }
      });
      
  }


}
