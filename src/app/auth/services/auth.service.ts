import { computed, Injectable, signal } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable, tap } from 'rxjs';
import { UserDto } from '../dto/user.dto';
import { StateManagementService } from '../../services/state-management.service';
import { AuthSession } from '../dto/auth-session.dto';

// hetha teba3 state management 
const AUTH_STORAGE_KEY = 'auth_session';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _session = signal<AuthSession | null>(null);

  readonly session = this._session.asReadonly();

  // User info (id, email) déduit de la session
  readonly user = computed<UserDto | null>(() => {
    const session = this._session();
    if (!session) return null;
    return {
      id: session.userId,
      email: session.email,
    };
  });

  // Access token / id pour l'intercepteur et autres services
  readonly token = computed(() => this._session()?.id ?? null);



  // Vérification de validité de session : expirationDate = created + ttl > current_date
  readonly isAuthenticated = computed(() => {
    const session = this._session();
    if (!session?.id || !session?.expirationDate) {
      return false;
    }
    return Date.now() < session.expirationDate;
  });

  constructor(
    private readonly http: HttpClient,
    private readonly stateManagement: StateManagementService
  ) {}

  init(): void {
    const savedSession = this.stateManagement.getState<AuthSession>(AUTH_STORAGE_KEY);

    if (savedSession && savedSession.id && savedSession.expirationDate) {
      if (Date.now() >= savedSession.expirationDate) {
        this.logout();
        return;
      }
      this._session.set(savedSession);
    } else {
      this.logout();
    }
  }

  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
      tap((response) => {
        // ttl (converti en millisecondes)
        const expirationDate = new Date(response.created).getTime() + (response.ttl * 1000);

        // sajil l response  + expirationDate + email
        const session: AuthSession = {
          ...response,
          expirationDate,
          email: credentials.email,
        };

        this._session.set(session);
        this.stateManagement.persist(AUTH_STORAGE_KEY, session);
      })
    );
  }

  logout() {
    this._session.set(null);
    this.stateManagement.clear(AUTH_STORAGE_KEY);
  }
}
