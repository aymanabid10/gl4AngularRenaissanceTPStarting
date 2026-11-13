import { Injectable, signal } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  #embauchees = signal<Cv[]>([]);
  embauchees = this.#embauchees.asReadonly();

  constructor() {}

  embauche(cv: Cv): boolean {
    if (!this.#embauchees().includes(cv)) {
      this.#embauchees.update((list) => [...list, cv]);
      return true;
    }
    return false;
  }
}
