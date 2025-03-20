import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionsFilterComponent } from './projections-filter.component';

describe('ProjectionsFilterComponent', () => {
  let component: ProjectionsFilterComponent;
  let fixture: ComponentFixture<ProjectionsFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectionsFilterComponent]
    });
    fixture = TestBed.createComponent(ProjectionsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
