import { TestBed } from '@angular/core/testing';

import { FetchRecopieService } from './fetch-recopie.service';

describe('FetchRecopieService', () => {
  let service: FetchRecopieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchRecopieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
