import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  private embauchees: Cv[] = [];
  #embauchees$ = new BehaviorSubject<Cv[]>([]);
  embauchees$ = this.#embauchees$.asObservable();

  constructor() {}

  getEmbauchees(): Cv[] {
    return this.embauchees;
  }

  embauche(cv: Cv): boolean {
    if (this.embauchees.indexOf(cv) == -1) {
      this.embauchees.push(cv);
      this.#embauchees$.next(this.embauchees);
      return true;
    }
    return false;
  }
}
