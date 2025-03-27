import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IngresosService } from './ingresos.service';
import { environment } from '../environments/environment';

describe('IngresosService', () => {
  let service: IngresosService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [IngresosService]
    });
    service = TestBed.inject(IngresosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all ingresos', () => {
    const mockIngresos = [
      { id_ingreso: 1, id_usuario: 1, monto: 100, metodo: 'transferencia', fecha: '2023-01-01' },
      { id_ingreso: 2, id_usuario: 2, monto: 200, metodo: 'efectivo', fecha: '2023-01-02' }
    ];

    service.getIngresos().subscribe(ingresos => {
      expect(ingresos.length).toBe(2);
      expect(ingresos).toEqual(mockIngresos);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/ingresos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIngresos);
  });

  it('should create a new egreso', () => {
    const newIngreso = { id_usuario: 1, monto: 100, metodo: 'transferencia', fecha: '2023-01-01' };
    const mockResponse = { id_egreso: 3, ...newIngreso };

    service.createIngreso(newIngreso).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/ingresos`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get egreso by id', () => {
    const mockIngreso = { id_ingreso: 1, id_usuario: 1, monto: 100, metodo: 'transferencia', fecha: '2023-01-01' };

    service.getIngresoById(1).subscribe(ingreso => {
      expect(ingreso).toEqual(mockIngreso);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/ingresos/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIngreso);
  });

  it('should get egresos by usuario id', () => {
    const mockIngresos = [
      { id_ingreso: 1, id_usuario: 1, monto: 100, metodo: 'transferencia', fecha: '2023-01-01' },
      { id_ingreso: 2, id_usuario: 1, monto: 200, metodo: 'efectivo', fecha: '2023-01-02' }
    ];

    service.getIngresosByUsuario(1).subscribe(ingresos => {
      expect(ingresos.length).toBe(2);
      expect(ingresos).toEqual(mockIngresos);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/ingresos/usuario/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockIngresos);
  });

  it('should update an ingreso', () => {
    const updatedIngreso = { id_usuario: 1, monto: 150, metodo: 'transferencia', fecha: '2023-01-01' };
    const mockResponse = { ingreso: 1, ...updatedIngreso };

    service.updateIngreso(1, updatedIngreso).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/ingresos/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete an egreso', () => {
    const mockResponse = { message: 'Ingreso eliminado correctamente' };

    service.deleteIngreso(1).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.API_URI}/ingresos/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});