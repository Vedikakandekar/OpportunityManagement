import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewContactButtonComponent } from './add-new-contact-button.component';

describe('AddNewContactButtonComponent', () => {
  let component: AddNewContactButtonComponent;
  let fixture: ComponentFixture<AddNewContactButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewContactButtonComponent]
    });
    fixture = TestBed.createComponent(AddNewContactButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
