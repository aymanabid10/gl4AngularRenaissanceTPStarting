import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable, catchError, map, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';

@Component({
    selector: 'app-details-cv',
    templateUrl: './details-cv.component.html',
    styleUrls: ['./details-cv.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DetailsCvComponent {
  // PROBLEM: snapshot read the id once, so /cv/1 → /cv/2 with the component still mounted showed
  // stale data, and cv was written from a subscribe callback.
  // → FIX: paramMap emits on every param change; switchMap cancels the in-flight request of the
  // previous id. The template subscribes through the async pipe.
  cv$: Observable<Cv>;

  constructor(
    private cvService: CvService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService
  ) {
    this.cv$ = this.activatedRoute.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      // PROBLEM: the error callback swallowed the error (unused `e`) and redirected silently.
      // → FIX: catchError sits inside switchMap so a failing id ends only that inner request and
      // the paramMap stream stays alive; the user gets a toast, then is sent back to the list.
      // EMPTY completes without emitting, so the template simply renders nothing.
      switchMap((id) =>
        this.cvService.getCvById(id).pipe(
          catchError(() => {
            this.toastr.error(`Ce CV est introuvable ou le serveur est indisponible`);
            this.router.navigate([APP_ROUTES.cv]);
            return EMPTY;
          })
        )
      )
    );
  }

  // deleteCv keeps a manual subscribe on purpose: it is a one-shot user action with no value to
  // bind to the template, and the HTTP observable completes on its own (nothing to unsubscribe).
  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.router.navigate([APP_ROUTES.cv]);
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
      },
    });
  }
}
