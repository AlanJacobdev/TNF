import { TestBed } from '@angular/core/testing';

import { FetchDemandeAdminService } from './fetch-demande-admin.service';

describe('FetchDemandeAdminService', () => {
  let service: FetchDemandeAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchDemandeAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
