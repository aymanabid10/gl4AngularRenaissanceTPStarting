import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      provideHttpClient(withInterceptors([authInterceptor])),
      provideHttpClientTesting(),
    ]
  }));

  it('should be created', () => {
    expect(authInterceptor).toBeTruthy();
  });
});
