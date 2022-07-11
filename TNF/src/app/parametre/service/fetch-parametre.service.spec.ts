import { TestBed } from '@angular/core/testing';

import { FetchParametreService } from './fetch-parametre.service';

describe('FetchParametreService', () => {
  let service: FetchParametreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchParametreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
