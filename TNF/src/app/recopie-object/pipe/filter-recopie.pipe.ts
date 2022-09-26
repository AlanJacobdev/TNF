import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRecopie'
})
/**
 * Classe permettant de filter un tableau de données
 */
export class FilterRecopiePipe implements PipeTransform {

    /**
   * Fonction vérifiant la présence d'un élement dans la liste des objets 
   * @param value : Liste des objets
   * @param args : Argument de filtrage (idObjet repère)
   * @returns Liste des élement comportant args
   */
  transform(value: any, args?: any): any {
    if (!value) return null;
    if (!args) return value;
    args = args.toLowerCase();
    return value.filter(function(item: any) {
        return item.idObjetRepere.toLowerCase().includes(args);
    });
  }

}
