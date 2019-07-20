import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCustomWidgetComponent } from './my-custom-widget.component';

describe('MyCustomWidgetComponent', () => {
  let component: MyCustomWidgetComponent;
  let fixture: ComponentFixture<MyCustomWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyCustomWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCustomWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
