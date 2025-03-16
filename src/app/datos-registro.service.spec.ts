import { TestBed } from '@angular/core/testing';

import { DatosRegistroService } from './datos-registro.service';

describe('DatosRegistroService', () => {
  let service: DatosRegistroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosRegistroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
