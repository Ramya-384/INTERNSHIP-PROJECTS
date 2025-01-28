import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctioneerdashboardComponent } from './auctioneerdashboard.component';

describe('AuctioneerdashboardComponent', () => {
  let component: AuctioneerdashboardComponent;
  let fixture: ComponentFixture<AuctioneerdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctioneerdashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctioneerdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
