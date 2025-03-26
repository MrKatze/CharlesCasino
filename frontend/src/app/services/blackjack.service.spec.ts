import { TestBed } from '@angular/core/testing';

import { BlackJackService } from './blackjack.service';

describe('BlackJackService', () => {
  let service: BlackJackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlackJackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
