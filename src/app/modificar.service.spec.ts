import { TestBed } from '@angular/core/testing';

import { ModificarService } from './modificar.service';

describe('ModificarService', () => {
  let service: ModificarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModificarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
