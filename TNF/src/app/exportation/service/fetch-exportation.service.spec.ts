import { TestBed } from '@angular/core/testing';

import { FetchExportationService } from './fetch-exportation.service';

describe('FetchExportationService', () => {
  let service: FetchExportationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchExportationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
