import { TestBed } from '@angular/core/testing';

import { FetchExportationGmaoService } from './fetch-exportation-gmao.service';

describe('FetchExportationGmaoService', () => {
  let service: FetchExportationGmaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchExportationGmaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
