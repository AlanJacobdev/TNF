import { TestBed } from '@angular/core/testing';

import { FetchVisuService } from './fetch-visu.service';

describe('FetchVisuService', () => {
  let service: FetchVisuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchVisuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
