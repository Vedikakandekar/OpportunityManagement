import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContactModalComponent } from './edit-contact-modal.component';

describe('EditContactModalComponent', () => {
  let component: EditContactModalComponent;
  let fixture: ComponentFixture<EditContactModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditContactModalComponent]
    });
    fixture = TestBed.createComponent(EditContactModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
