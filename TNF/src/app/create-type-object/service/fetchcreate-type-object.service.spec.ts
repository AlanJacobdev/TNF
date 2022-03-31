import { TestBed } from '@angular/core/testing';

import { FetchcreateTypeObjectService } from './fetchcreate-type-object.service';

describe('FetchcreateTypeObjectService', () => {
  let service: FetchcreateTypeObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchcreateTypeObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
