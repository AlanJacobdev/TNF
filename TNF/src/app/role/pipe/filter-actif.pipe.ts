import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterActif'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterActifPipe implements PipeTransform {

   /**
   * Fonction vérifiant la présence d'un élement dans la liste des role
   * @param value : Liste des role
   * @returns Liste des rôles actifs
   */
  transform(value: any): any {
    if (!value) return null;
  
    return value.filter(function(item: any) {
      if (JSON.stringify(item.isPaste) == 'true') {
        return true
      }
      return false
    });
      
      
    
  }

}
