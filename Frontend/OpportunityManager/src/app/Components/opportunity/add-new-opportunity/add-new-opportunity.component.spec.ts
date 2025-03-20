import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewOpportunityComponent } from './add-new-opportunity.component';

describe('AddNewOpportunityComponent', () => {
  let component: AddNewOpportunityComponent;
  let fixture: ComponentFixture<AddNewOpportunityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewOpportunityComponent]
    });
    fixture = TestBed.createComponent(AddNewOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
