import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingChangesComponent } from './pending-changes.component';

describe('PendingChangesComponent', () => {
  let component: PendingChangesComponent;
  let fixture: ComponentFixture<PendingChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingChangesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
