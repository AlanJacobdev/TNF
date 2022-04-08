import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyObjectComponent } from './modify-object.component';

describe('ModifyObjectComponent', () => {
  let component: ModifyObjectComponent;
  let fixture: ComponentFixture<ModifyObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifyObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
