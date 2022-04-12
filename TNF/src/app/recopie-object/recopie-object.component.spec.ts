import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecopieObjectComponent } from './recopie-object.component';

describe('RecopieObjectComponent', () => {
  let component: RecopieObjectComponent;
  let fixture: ComponentFixture<RecopieObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecopieObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecopieObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
