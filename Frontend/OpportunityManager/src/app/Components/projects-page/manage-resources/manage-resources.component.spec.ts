import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageResourcesComponent } from './manage-resources.component';

describe('ManageResourcesComponent', () => {
  let component: ManageResourcesComponent;
  let fixture: ComponentFixture<ManageResourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageResourcesComponent]
    });
    fixture = TestBed.createComponent(ManageResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
