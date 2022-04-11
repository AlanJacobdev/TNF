import { TestBed } from '@angular/core/testing';

import { FetchDeleteObjectService } from './fetch-delete-object.service';

describe('FetchDeleteObjectService', () => {
  let service: FetchDeleteObjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchDeleteObjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
