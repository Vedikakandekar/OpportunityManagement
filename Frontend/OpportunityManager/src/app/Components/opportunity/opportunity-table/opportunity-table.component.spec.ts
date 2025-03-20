import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityTableComponent } from './opportunity-table.component';

describe('OpportunityTableComponent', () => {
  let component: OpportunityTableComponent;
  let fixture: ComponentFixture<OpportunityTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OpportunityTableComponent]
    });
    fixture = TestBed.createComponent(OpportunityTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
