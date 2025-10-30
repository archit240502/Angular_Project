import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitList } from './fruit-list';

describe('FruitList', () => {
  let component: FruitList;
  let fixture: ComponentFixture<FruitList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FruitList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
