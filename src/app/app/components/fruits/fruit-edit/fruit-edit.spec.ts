import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FruitEdit } from './fruit-edit';

describe('FruitEdit', () => {
  let component: FruitEdit;
  let fixture: ComponentFixture<FruitEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FruitEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FruitEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
