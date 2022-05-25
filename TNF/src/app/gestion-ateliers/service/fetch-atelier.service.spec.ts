import { TestBed } from '@angular/core/testing';

import { FetchAtelierService } from './fetch-atelier.service';

describe('FetchAtelierService', () => {
  let service: FetchAtelierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchAtelierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
