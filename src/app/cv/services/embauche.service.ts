import { Injectable, signal } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  // I changed the array to private signal to make it
  // reactive and to avoid direct modification from outside
  #embauchees = signal<Cv[]>([]);
  embauchees = this.#embauchees.asReadonly();

  /**
   *
   * Embauche une personne si elle ne l'est pas encore
   * Sinon il retourne false
   *
   * @param cv : Cv
   * @returns boolean
   */
  embauche(cv: Cv): boolean {
    // I am using some instead of indexOf because indexOf 
    // compares references 
    if (this.#embauchees().some((e) => e.id === cv.id) == false) {
      this.#embauchees.update((embauchees) => [...embauchees, cv]);
      return true;
    }
    return false;
  }
}
