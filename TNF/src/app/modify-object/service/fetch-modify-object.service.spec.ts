import { TestBed } from '@angular/core/testing';

import { FetchModifyObjectService } from './fetch-modify-object.service';

describe('FetchModifyObjectService', () => {
  let service: FetchModifyObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchModifyObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
