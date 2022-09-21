import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterNU'
})

/**
 * Classe permettant de filter un tableau de données
 */
export class FilterNUPipe implements PipeTransform {

  /**
   * Fonction vérifiant la présence d'un élement dans les numéros uniques
   * @param value : Liste des Numéros uniques
   * @param args : Argument de filtrage
   * @returns Liste des élement comportant args
   */
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    return value.filter(function(item: any) {
    return item.numeroUnique.toLowerCase().includes(args);
      
    });
  }

}
