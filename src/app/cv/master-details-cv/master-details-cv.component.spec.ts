import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { MasterDetailsCvComponent } from './master-details-cv.component';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';

@Component({ template: 'detail works' })
class DetailStubComponent {}

describe('MasterDetailsCvComponent', () => {
  const cvs = [
    new Cv(1, 'john', 'doe', 'dev', 'a.jpg', '1', 30),
    new Cv(2, 'jane', 'roe', 'ops', 'b.jpg', '2', 28),
  ];

  let cvService: jasmine.SpyObj<CvService>;
  let toastr: jasmine.SpyObj<ToastrService>;

  async function navigateTo(url: string): Promise<RouterTestingHarness> {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(url);
    return harness;
  }

  beforeEach(() => {
    cvService = jasmine.createSpyObj<CvService>('CvService', ['getCvs']);
    toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        { provide: CvService, useValue: cvService },
        { provide: ToastrService, useValue: toastr },
        provideRouter([
          {
            path: 'list',
            component: MasterDetailsCvComponent,
            children: [{ path: ':id', component: DetailStubComponent }],
          },
        ]),
      ],
    });
  });

  it('links each cv to its detail child route', async () => {
    cvService.getCvs.and.returnValue(of(cvs));

    const harness = await navigateTo('/list');

    const hrefs = Array.from<HTMLAnchorElement>(
      harness.routeNativeElement!.querySelectorAll('a')
    ).map((link) => link.getAttribute('href'));
    expect(hrefs).toEqual(['/list/1', '/list/2']);
  });

  it('renders the selected cv detail in the outlet and highlights its link', async () => {
    cvService.getCvs.and.returnValue(of(cvs));

    const harness = await navigateTo('/list/2');

    const element: HTMLElement = harness.routeNativeElement!;
    expect(element.textContent).toContain('detail works');
    const active = element.querySelectorAll('a.active');
    expect(active.length).toBe(1);
    expect(active[0].getAttribute('href')).toBe('/list/2');
  });

  it('shows an error toast and an empty list when the cvs cannot be loaded', async () => {
    cvService.getCvs.and.returnValue(throwError(() => new Error('server down')));

    const harness = await navigateTo('/list');

    expect(harness.routeNativeElement!.querySelectorAll('a').length).toBe(0);
    expect(toastr.error).toHaveBeenCalledTimes(1);
  });
});
