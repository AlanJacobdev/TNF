import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametreUtilisateurComponent } from './parametre-utilisateur.component';

describe('ParametreUtilisateurComponent', () => {
  let component: ParametreUtilisateurComponent;
  let fixture: ComponentFixture<ParametreUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametreUtilisateurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametreUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
