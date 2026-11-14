import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, Observable, of, startWith } from 'rxjs';

import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';

/**
 * Every state the list can be in. A discriminated union makes invalid combinations
 * (e.g. loading with cvs, success without cvs) impossible to express.
 */
export type CvListState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'empty' }
  | { status: 'success'; cvs: Cv[] };

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
  //
  // PROBLEM: the stream only handled failure. While the request was pending the template
  // showed an empty list, and a successful empty list looked the same as a failed one.
  // FIX: map the result to an explicit status, start with 'loading', and let the template
  // render one block per status.
  state$: Observable<CvListState> = this.cvService.getCvs().pipe(
    map((cvs): CvListState => (cvs.length ? { status: 'success', cvs } : { status: 'empty' })),
    catchError(() => {
      this.toastr.error(`Problème avec le serveur, impossible de charger les CVs.`);
      return of<CvListState>({ status: 'error' });
    }),
    startWith<CvListState>({ status: 'loading' })
  );
}
