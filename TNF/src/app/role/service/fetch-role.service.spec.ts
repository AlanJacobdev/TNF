import { TestBed } from '@angular/core/testing';

import { FetchRoleService } from './fetch-role.service';

describe('FetchRoleService', () => {
  let service: FetchRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
