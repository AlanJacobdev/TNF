import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDmdAdmin'
})
/**
 * Classe permettant de filter un tableau de données
 */

export class FilterDmdAdminPipe implements PipeTransform {

  /**
   * Fonction vérifiant la présence d'un élement dans les demandes de suppression
   * @param value : Liste des objets
   * @param args : Argument de filtrage
   * @returns Liste des élement comportant args
   */
  transform(value: any, args?: any, type?: any): any {
    if (!value) return null;
    if (!args) return value;
   
    if(type != null) {
      if(type =='A'){
        return value.filter(function(item: any) {
          return JSON.stringify({profilCreation : item.profilCreation, motif: item.motif})
            .includes(args);
        });
      } else {
        return value.filter(function(item: any) {
          return JSON.stringify({profilCreation : item.profilCreation, profilModification: item.profilModification})
            .includes(args);
        });
      }

    }
  }

}
