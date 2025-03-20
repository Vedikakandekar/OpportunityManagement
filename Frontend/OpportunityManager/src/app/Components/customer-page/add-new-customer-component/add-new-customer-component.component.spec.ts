import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCustomerComponentComponent } from './add-new-customer-component.component';

describe('AddNewCustomerComponentComponent', () => {
  let component: AddNewCustomerComponentComponent;
  let fixture: ComponentFixture<AddNewCustomerComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewCustomerComponentComponent]
    });
    fixture = TestBed.createComponent(AddNewCustomerComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
