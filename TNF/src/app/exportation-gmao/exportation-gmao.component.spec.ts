import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportationGmaoComponent } from './exportation-gmao.component';

describe('ExportationGmaoComponent', () => {
  let component: ExportationGmaoComponent;
  let fixture: ComponentFixture<ExportationGmaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportationGmaoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportationGmaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
