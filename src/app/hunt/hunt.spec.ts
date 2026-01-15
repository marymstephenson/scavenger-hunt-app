import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hunt } from './hunt';

describe('Hunt', () => {
  let component: Hunt;
  let fixture: ComponentFixture<Hunt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hunt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hunt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
