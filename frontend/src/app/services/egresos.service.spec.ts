import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EgresosService } from './egresos.service';
import { environment } from '../environments/environment';

describe('EgresosService', () => {
  let service: EgresosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EgresosService]
    });
    service = TestBed.inject(EgresosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all egresos', () => {
    const mockEgresos = [
      { id_egreso: 1, id_usuario: 1, monto: 100, metodo: 'transferencia', fecha: '2023-01-01' },
      { id_egreso: 2, id_usuario: 2, monto: 200, metodo: 'efectivo', fecha: '2023-01-02' }
    ];

    service.getEgresos().subscribe(egresos => {
      expect(egresos.length).toBe(2);
      expect(egresos).toEqual(mockEgresos);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/egresos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEgresos);
  });

  it('should create a new egreso', () => {
    const newEgreso = { id_usuario: 1, monto: 100, metodo: 'transferencia', fecha: '2023-01-01' };
    const mockResponse = { id_egreso: 3, ...newEgreso };

    service.createEgreso(newEgreso).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/egresos`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get egreso by id', () => {
    const mockEgreso = { id_egreso: 1, id_usuario: 1, monto: 100, metodo: 'transferencia', fecha: '2023-01-01' };

    service.getEgresoById(1).subscribe(egreso => {
      expect(egreso).toEqual(mockEgreso);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/egresos/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEgreso);
  });

  it('should get egresos by usuario id', () => {
    const mockEgresos = [
      { id_egreso: 1, id_usuario: 1, monto: 100, metodo: 'transferencia', fecha: '2023-01-01' },
      { id_egreso: 2, id_usuario: 1, monto: 200, metodo: 'efectivo', fecha: '2023-01-02' }
    ];

    service.getEgresosByUsuario(1).subscribe(egresos => {
      expect(egresos.length).toBe(2);
      expect(egresos).toEqual(mockEgresos);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/egresos/usuario/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEgresos);
  });

  it('should update an egreso', () => {
    const updatedEgreso = { id_usuario: 1, monto: 150, metodo: 'transferencia', fecha: '2023-01-01' };
    const mockResponse = { id_egreso: 1, ...updatedEgreso };

    service.updateEgreso(1, updatedEgreso).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/egresos/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete an egreso', () => {
    const mockResponse = { message: 'Egreso eliminado correctamente' };

    service.deleteEgreso(1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/egresos/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});