import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsShopComponent } from './points-shop.component';

describe('PointsShopComponent', () => {
  let component: PointsShopComponent;
  let fixture: ComponentFixture<PointsShopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointsShopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointsShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
