import { TestBed } from '@angular/core/testing';

import { FetchCreateObjectService } from './fetch-create-object.service';

describe('FetchCreateObjectService', () => {
  let service: FetchCreateObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchCreateObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
