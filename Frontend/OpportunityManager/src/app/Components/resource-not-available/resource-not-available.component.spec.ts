import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceNotAvailableComponent } from './resource-not-available.component';

describe('ResourceNotAvailableComponent', () => {
  let component: ResourceNotAvailableComponent;
  let fixture: ComponentFixture<ResourceNotAvailableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceNotAvailableComponent]
    });
    fixture = TestBed.createComponent(ResourceNotAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
