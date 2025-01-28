import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidpageComponent } from './bidpage.component';

describe('BidpageComponent', () => {
  let component: BidpageComponent;
  let fixture: ComponentFixture<BidpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BidpageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
