import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitAdd } from './fruit-add';

describe('FruitAdd', () => {
  let component: FruitAdd;
  let fixture: ComponentFixture<FruitAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FruitAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
