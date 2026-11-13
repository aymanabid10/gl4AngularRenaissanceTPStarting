import { Injectable } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";
import { Observable, catchError, of } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (!this.shouldPreload(route)) {
      return of(null);
    }

    return load().pipe(catchError(() => of(null)));
  }

  private shouldPreload(route: Route): boolean {
    if (route.data?.["preload"] !== true) {
      return false;
    }

    const connection =
      typeof navigator === "undefined"
        ? undefined
        : (navigator as Navigator & { connection?: {saveData?: boolean; effectiveType?: string;} }).connection;

    if (!connection) {
      return true;
    }

    if (connection.saveData) {
      return false;
    }

    return (
      connection.effectiveType !== "slow-2g" &&
      connection.effectiveType !== "2g" && 
      connection.effectiveType !== "3g"
    );
  }
}
