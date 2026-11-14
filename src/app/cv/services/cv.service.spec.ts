import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { CvService } from './cv.service';
import { Cv } from '../model/cv';
import { HTTP_CACHE_TTL } from '../../interceptors/http-cache.context';
import { HttpCacheService } from '../../services/http-cache.service';
import { API } from '../../../config/api.config';

describe('CvService', () => {
  let service: CvService;
  let http: HttpTestingController;
  let httpCache: jasmine.SpyObj<HttpCacheService>;

  beforeEach(() => {
    httpCache = jasmine.createSpyObj<HttpCacheService>('HttpCacheService', ['clear']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: HttpCacheService, useValue: httpCache },
      ],
    });
    service = TestBed.inject(CvService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the cv list to be cached', () => {
    service.getCvs().subscribe();

    const request = http.expectOne(API.cv);
    expect(request.request.context.get(HTTP_CACHE_TTL)).toBeGreaterThan(0);
    request.flush([]);
  });

  it('asks for a cv detail to be cached', () => {
    service.getCvById(3).subscribe();

    const request = http.expectOne(API.cv + 3);
    expect(request.request.context.get(HTTP_CACHE_TTL)).toBeGreaterThan(0);
    request.flush(new Cv(3));
  });

  it('clears the cache once a cv is deleted', () => {
    service.deleteCvById(3).subscribe();

    http.expectOne(API.cv + 3).flush({});

    expect(httpCache.clear).toHaveBeenCalledTimes(1);
  });

  it('clears the cache once a cv is added', () => {
    service.addCv(new Cv(0, 'john', 'doe')).subscribe();

    http.expectOne(API.cv).flush(new Cv(4));

    expect(httpCache.clear).toHaveBeenCalledTimes(1);
  });

  it('keeps the cache when the deletion fails', () => {
    service.deleteCvById(3).subscribe({ error: () => undefined });

    http.expectOne(API.cv + 3).flush('error', { status: 500, statusText: 'Server Error' });

    expect(httpCache.clear).not.toHaveBeenCalled();
  });
});
