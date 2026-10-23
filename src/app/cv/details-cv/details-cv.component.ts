import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
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
export class DetailsCvComponent implements OnInit {
  cv: Cv | null = null;
  constructor(
    private cvService: CvService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // PROBLEM: snapshot reads the id once, so navigating /cv/1 → /cv/2 while this component stays
    // mounted shows stale data; cv is also written from a callback instead of a bound stream.
    // → FIX (TP1-28): cv$ = paramMap.pipe(switchMap(getCvById)) consumed with the async pipe.
    const id = this.activatedRoute.snapshot.params['id'];
    this.cvService.getCvById(+id).subscribe({
        next: (cv) => {
          this.cv = cv;
        },
        // PROBLEM: the error is swallowed (unused `e`) and the user is redirected with no feedback.
        // → FIX (TP1-29): catchError that surfaces a toast, then redirects.
        error: (e) => {
          this.router.navigate([APP_ROUTES.cv]);
        },
      });
  }
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
