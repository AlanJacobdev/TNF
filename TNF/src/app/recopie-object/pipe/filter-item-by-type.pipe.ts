import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterItemByType'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterItemByTypePipe implements PipeTransform {

  /**
   * Fonction vérifiant la présence d'un élement dans la liste des objets 
   * @param value : Liste des objets
   * @param args : Argument de filtrage (identifiant item)
   * @returns Liste des élement comportant args
   */
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;

    args = args.toLowerCase();
    return value.filter(function(item: any) {
        return item.idItem.toLowerCase().includes(args);
    });
  }

}
