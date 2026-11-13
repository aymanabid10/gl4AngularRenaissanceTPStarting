import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';

import { CvService } from '../services/cv.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';

/**
 * Master of the master/detail pattern: lists the cvs and hosts, in its outlet, the detail
 * of the cv selected through the URL (/cv/list/:id).
 */
@Component({
  selector: 'app-master-details-cv',
  templateUrl: './master-details-cv.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, RouterOutlet, DefaultImagePipe],
})
export class MasterDetailsCvComponent {
  constructor(
    private cvService: CvService,
    private toastr: ToastrService
  ) {}

  // The selection lives in the URL, not in a field or a Subject: the list only describes the
  // cvs, and routerLinkActive in the template derives which one is selected from the router.
  cvs$ = this.cvService.getCvs().pipe(
    catchError(() => {
      this.toastr.error(`Problème avec le serveur, impossible de charger les CVs.`);
      return of([]);
    })
  );
}
