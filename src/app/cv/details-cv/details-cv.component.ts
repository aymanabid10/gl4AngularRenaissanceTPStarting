import { Component, ChangeDetectionStrategy, inject, input,effect } from '@angular/core';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-details-cv',
    templateUrl: './details-cv.component.html',
    styleUrls: ['./details-cv.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DefaultImagePipe]
})
export class DetailsCvComponent{
  private cvService = inject(CvService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  authService = inject(AuthService);
  id = input.required<string>();
  cvResource = rxResource({
    params: () => +this.id(),
    stream: ({ params: id }) => this.cvService.getCvById(id),
  });
  errorHandlingEffect = effect(() => {
      if (this.cvResource.error()) {
        this.router.navigate([APP_ROUTES.cv]);
      }
    });

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
