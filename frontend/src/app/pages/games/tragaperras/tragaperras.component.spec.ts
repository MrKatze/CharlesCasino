import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TragaperrasComponent } from './tragaperras.component';

describe('TragaperrasComponent', () => {
  let component: TragaperrasComponent;
  let fixture: ComponentFixture<TragaperrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TragaperrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TragaperrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
