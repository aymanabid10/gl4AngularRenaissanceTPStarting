import { Injectable } from "@angular/core";
import { Cv } from "../model/cv";
import { Observable, Subject, tap } from "rxjs";
import { HttpClient, HttpParams } from "@angular/common/http";
import { API } from "../../../config/api.config";
import { withHttpCache } from "../../interceptors/http-cache.context";
import { HttpCacheService } from "../../services/http-cache.service";

@Injectable({
  providedIn: "root",
})
export class CvService {
  private cvs: Cv[] = [];
  /**
   * Le subject permettant de créer le flux des cvs sélectionnés
   */
  #selectCvSuject$ = new Subject<Cv>();
  /**
   * Le flux des cvs sélectionnés
   */
  selectCv$ = this.#selectCvSuject$.asObservable();
  constructor(
    private http: HttpClient,
    private httpCache: HttpCacheService
  ) {
    this.cvs = [
      new Cv(1, "aymen", "sellaouti", "teacher", "as.jpg", "1234", 40),
      new Cv(2, "skander", "sellaouti", "enfant", "       ", "1234", 4),
    ];
  }

  /**
   *
   * Retourne un liste fictive de cvs
   *
   * @returns CV[]
   *
   */
  getFakeCvs(): Cv[] {
    return this.cvs;
  }

  /**
   *
   * Retourne la liste des cvs de l'API
   *
   * @returns CV[]
   *
   */
  getCvs(): Observable<Cv[]> {
    return this.http.get<Cv[]>(API.cv, { context: withHttpCache() });
  }

  /**
   *
   * supprime un cv par son id de l'API
   *
   * @param id: number
   * @returns CV[]
   *
   */
  deleteCvById(id: number): Observable<any> {
    return this.http.delete<any>(API.cv + id).pipe(tap(() => this.invalidateCvCache()));
  }

  addCv(cv: Cv): Observable<Cv> {
    return this.http.post<any>(API.cv, cv).pipe(tap(() => this.invalidateCvCache()));
  }

  /**
   * PROBLEM: the 1 min HTTP cache would keep serving the previous list/detail after an add or a
   * delete, so the master list could still show a removed cv.
   * → FIX: any write drops the cached responses; the next read goes back to the network.
   * HttpCacheService has no per-url eviction, so the whole cache is cleared.
   */
  private invalidateCvCache(): void {
    this.httpCache.clear();
  }

  /**
   *
   * Retourne un cv par son id de l'API
   *
   * @param id: number
   * @returns CV[]
   *
   */
  getCvById(id: number): Observable<Cv> {
    return this.http.get<Cv>(API.cv + id, { context: withHttpCache() });
  }

  /**
   *
   * Cherche un cv avec son id dans lai liste fictive de cvs
   *
   * @param id
   * @returns Cv | null
   */
  findCvById(id: number): Cv | null {
    return this.cvs.find((cv) => cv.id == id) ?? null;
  }

  /**
   *
   * Supprime un cv s'il le trouve
   *
   * @param cv : Cv
   * @returns boolean
   */
  deleteCv(cv: Cv): boolean {
    const index = this.cvs.indexOf(cv);
    if (index > -1) {
      this.cvs.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Recherche les cvs dont le name contient la chaine name passée en paramètre
   * @param name : string
   * @returns cvs Cv[]
   */
  selectByName(name: string) {
    const search = `{"where":{"name":{"like":"%${name}%"}}}`;
    const params = new HttpParams().set("filter", search);
    return this.http.get<any>(API.cv, { params });
  }
  /**
   * Recherche les cvs dont la valeur est égale à la chaine passée en paramètre
   * @param property : string, la propriété sur laquelle on va requeter
   * @param value : string, la valeur de la propriété sur laquelle on va requeter
   * @returns cvs Cv[]
   */
  selectByProperty(property: string, value: string) {
    const search = `{"where":{"${property}":"${value}"}}`;
    const params = new HttpParams().set("filter", search);
    return this.http.get<Cv[]>(API.cv, { params });
  }

  /**
   * Permet d'ajouter un cv au flux des cvs sélectionnés
   *
   * @param cv : Le cv à ajouter dans le flux des cvs sélectionnés
   */
  selectCv(cv: Cv) {
    this.#selectCvSuject$.next(cv);
  }
}
