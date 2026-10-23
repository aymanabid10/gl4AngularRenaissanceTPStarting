import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLinkActive, RouterLink]
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastrService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly user = this.authService.user;

  logout() {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.login]);
    this.toastr.warning(`Au plaisir de vous revoir :(`);
  }
}
