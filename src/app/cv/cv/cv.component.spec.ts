import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { firstValueFrom, of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { CvComponent } from './cv.component';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { LoggerService } from '../../services/logger.service';

describe('CvComponent', () => {
  const serverCvs = [new Cv(1, 'doe', 'john', 'dev', 'a.jpg', '1', 30)];
  const fakeCvs = [new Cv(2, 'fake', 'fake', 'fake', 'f.jpg', '2', 20)];

  let fixture: ComponentFixture<CvComponent>;
  let cvService: jasmine.SpyObj<CvService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  function createComponent(): CvComponent {
    fixture = TestBed.createComponent(CvComponent);
    return fixture.componentInstance;
  }

  beforeEach(() => {
    cvService = jasmine.createSpyObj<CvService>('CvService', ['getCvs', 'getFakeCvs'], {
      selectCv$: of(),
    });
    cvService.getFakeCvs.and.returnValue(fakeCvs);
    toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['info', 'error']);

    TestBed.configureTestingModule({
      declarations: [CvComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: CvService, useValue: cvService },
        { provide: ToastrService, useValue: toastr },
        { provide: LoggerService, useValue: jasmine.createSpyObj('LoggerService', ['logger']) },
      ],
    });
  });

  it('does not run init side effects in the constructor', () => {
    cvService.getCvs.and.returnValue(of(serverCvs));

    createComponent();

    expect(toastr.info).not.toHaveBeenCalled();
  });

  it('emits the server cvs when the request succeeds', async () => {
    cvService.getCvs.and.returnValue(of(serverCvs));

    const component = createComponent();

    expect(await firstValueFrom(component.cvs$)).toEqual(serverCvs);
    expect(toastr.error).not.toHaveBeenCalled();
  });

  it('falls back to the fake cvs and shows an error toast when the request fails', async () => {
    cvService.getCvs.and.returnValue(throwError(() => new Error('server down')));

    const component = createComponent();

    expect(await firstValueFrom(component.cvs$)).toEqual(fakeCvs);
    expect(toastr.error).toHaveBeenCalledTimes(1);
  });

  it('shows the welcome toast once on init', () => {
    cvService.getCvs.and.returnValue(of(serverCvs));

    createComponent();
    fixture.detectChanges();

    expect(toastr.info).toHaveBeenCalledTimes(1);
  });
});
