import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated']);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService },
      ],
    });
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('allows access when authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );

    expect(result).toBeTrue();
  });

  it('blocks access when not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as never, {} as never)
    );

    expect(result).toBeFalse();
  });
});
