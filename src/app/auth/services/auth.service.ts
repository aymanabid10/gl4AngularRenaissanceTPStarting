import { computed, Injectable, signal } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { Observable, tap } from 'rxjs';
import { UserDto } from '../dto/user.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  // hetha l user record bich trackiw garder la trace (id ,email)
  private _user = signal<UserDto | null>(null)
  // hetha  token mawjoud fi  local  storage nfetchiwoh bich nchoufouh  authenticated wala le 
  private _token = signal<string | null>(null)


  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();

  // is authenticated nkhawloha computed khaterha derived mil  signal token (derived state)
  readonly isAuthenticated = computed(() => !!this._token());

  constructor(private http: HttpClient) {
    // kol  creation  tfetchi  state taa user
    this.loadStateFromLocalStorage();
  }
  private loadStateFromLocalStorage() {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      try {
        this._token.set(token);
        this._user.set(JSON.parse(user));
      } catch {
        this.logout(); // khater ken il  parsing function tfaili il app tnajem  ticrashi 
      }
    }
    else
    {
      this.logout()
    }
  }
  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
      // sta3malna tap khater token w user jaw mil backend fi response u lauthservice lezem yitupdata  kbal  mil response tousel li login compoenent khatrou  howa li yithokm fil  UI
      tap(
        (response) => {
          const user: UserDto = {
            id: response.userId,
            email: credentials.email
          }
          this._token.set(response.id)
          this._user.set({ id: user.id, email: user.email })
          localStorage.setItem('token', response.id)
          localStorage.setItem('user', JSON.stringify(user))
        }
      )
    );
  }

  logout() {
    this._token.set(null)
    localStorage.removeItem('token');
    this._user.set(null)
    localStorage.removeItem('user')
  }
}
