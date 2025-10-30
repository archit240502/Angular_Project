import { TestBed } from '@angular/core/testing';

import { Fruit } from './fruit';

describe('Fruit', () => {
  let service: Fruit;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fruit);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
