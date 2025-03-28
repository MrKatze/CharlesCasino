import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnunciosComponent } from './anuncios.component';
import { IngresosService } from '../../services/ingresos.service';
import { of, throwError } from 'rxjs';

describe('AnunciosComponent', () => {
  let component: AnunciosComponent;
  let fixture: ComponentFixture<AnunciosComponent>;
  let mockIngresosService: jasmine.SpyObj<IngresosService>;

  beforeEach(async () => {
    mockIngresosService = jasmine.createSpyObj('IngresosService', ['createIngreso']);

    await TestBed.configureTestingModule({
      declarations: [AnunciosComponent],
      providers: [{ provide: IngresosService, useValue: mockIngresosService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AnunciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should alert when user is not identified', () => {
    spyOn(window, 'alert');
    spyOn(localStorage, 'getItem').and.returnValue(null);

    component.otorgarRecompensa();

    expect(window.alert).toHaveBeenCalledWith('Usuario no identificado. Por favor, inicia sesión.');
  });

  it('should call createIngreso and alert success on valid user', () => {
    spyOn(window, 'alert');
    spyOn(localStorage, 'getItem').and.returnValue('1');
    mockIngresosService.createIngreso.and.returnValue(of({ success: true }));

    component.otorgarRecompensa();

    expect(mockIngresosService.createIngreso).toHaveBeenCalledWith({
      id_usuario: 1,
      monto: 45,
      metodo: 'ver_anuncio',
      fecha: jasmine.any(String),
      hora: jasmine.any(String)
    });
    expect(window.alert).toHaveBeenCalledWith('¡Recompensa de 45 monedas otorgada con éxito!');
  });

  it('should alert error when createIngreso fails', () => {
    spyOn(window, 'alert');
    spyOn(localStorage, 'getItem').and.returnValue('1');
    mockIngresosService.createIngreso.and.returnValue(throwError(() => new Error('Error al otorgar recompensa')));

    component.otorgarRecompensa();

    expect(mockIngresosService.createIngreso).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Hubo un problema al otorgar la recompensa.');
  });
});