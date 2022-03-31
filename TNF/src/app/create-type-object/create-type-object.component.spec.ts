import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTypeObjectComponent } from './create-type-object.component';

describe('CreateTypeObjectComponent', () => {
  let component: CreateTypeObjectComponent;
  let fixture: ComponentFixture<CreateTypeObjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTypeObjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTypeObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
