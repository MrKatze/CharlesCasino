import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackJackComponent } from './blackjack.component';

describe('BlackJackComponent', () => {
  let component: BlackJackComponent;
  let fixture: ComponentFixture<BlackJackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlackJackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlackJackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
