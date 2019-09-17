import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusiveContentComponent } from './exclusive-content.component';

describe('ExclusiveContentComponent', () => {
  let component: ExclusiveContentComponent;
  let fixture: ComponentFixture<ExclusiveContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExclusiveContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExclusiveContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
