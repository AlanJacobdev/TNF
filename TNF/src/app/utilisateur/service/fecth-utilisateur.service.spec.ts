import { TestBed } from '@angular/core/testing';

import { FecthUtilisateurService } from './fecth-utilisateur.service';

describe('FecthUtilisateurService', () => {
  let service: FecthUtilisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FecthUtilisateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
