import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchTable'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class SearchTablePipe implements PipeTransform {
  
  /**
   * Fonction vérifiant l'existence de type comportant args
   * @param value : Liste de données
   * @param args : Argument de filtrage
   * @returns Liste filtrée
   */
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    return value.filter(function(item: any) {
        return item.idType.toLowerCase().includes(args);
      
    });
  }

}
