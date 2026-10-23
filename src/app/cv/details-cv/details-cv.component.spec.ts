import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { Subject, firstValueFrom, of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { DetailsCvComponent } from './details-cv.component';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { AuthService } from '../../auth/services/auth.service';

describe('DetailsCvComponent', () => {
  const cv = new Cv(1, 'doe', 'john', 'dev', 'a.jpg', '1', 30);

  let cvService: jasmine.SpyObj<CvService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;
  let params$: Subject<ReturnType<typeof convertToParamMap>>;

  function createComponent(): DetailsCvComponent {
    return TestBed.createComponent(DetailsCvComponent).componentInstance;
  }

  beforeEach(() => {
    cvService = jasmine.createSpyObj<CvService>('CvService', ['getCvById', 'deleteCvById']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['error', 'success']);
    params$ = new Subject();

    TestBed.configureTestingModule({
      declarations: [DetailsCvComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CvService, useValue: cvService },
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: toastr },
        { provide: ActivatedRoute, useValue: { paramMap: params$ } },
        { provide: AuthService, useValue: { isAuthenticated: () => false } },
      ],
    });
  });

  it('loads the cv matching the route id', async () => {
    cvService.getCvById.and.returnValue(of(cv));
    const result = firstValueFrom(createComponent().cv$);

    params$.next(convertToParamMap({ id: '1' }));

    expect(await result).toEqual(cv);
    expect(cvService.getCvById).toHaveBeenCalledWith(1);
  });

  it('reloads the cv when the route id changes while the component stays mounted', () => {
    cvService.getCvById.and.returnValue(of(cv));
    createComponent().cv$.subscribe();

    params$.next(convertToParamMap({ id: '1' }));
    params$.next(convertToParamMap({ id: '2' }));

    expect(cvService.getCvById.calls.allArgs()).toEqual([[1], [2]]);
  });

  it('shows a toast and redirects to the list when the cv cannot be loaded', () => {
    cvService.getCvById.and.returnValue(throwError(() => new Error('404')));
    createComponent().cv$.subscribe();

    params$.next(convertToParamMap({ id: '99' }));

    expect(toastr.error).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['cv']);
  });

  it('keeps reacting to later ids after one id failed', () => {
    cvService.getCvById.and.returnValues(
      throwError(() => new Error('404')),
      of(cv),
    );
    createComponent().cv$.subscribe();

    params$.next(convertToParamMap({ id: '99' }));
    params$.next(convertToParamMap({ id: '1' }));

    expect(cvService.getCvById).toHaveBeenCalledTimes(2);
  });
});
