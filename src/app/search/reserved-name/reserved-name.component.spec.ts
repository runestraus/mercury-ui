import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservedNameComponent } from './reserved-name.component';

describe('ReservedNameComponent', () => {
  let component: ReservedNameComponent;
  let fixture: ComponentFixture<ReservedNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservedNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservedNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
