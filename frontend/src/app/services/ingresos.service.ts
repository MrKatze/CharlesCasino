import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {
  
  constructor(private http: HttpClient) {}

  // Obtener todos los Ingresos
  getIngresos(): Observable<any> {
    return this.http.get(`${environment.API_URI}/ingresos`);
  }

  // Crear un nuevo egreso
  createIngreso(ingresoData: any): Observable<any> {
    return this.http.post(`${environment.API_URI}/ingresos`, ingresoData);
  }

  // Obtener un egreso por ID
  getIngresoById(id: number): Observable<any> {
    return this.http.get(`${environment.API_URI}/ingresos/${id}`);
  }

  // Obtener Ingresos por ID de usuario
  getIngresosByUsuario(id_usuario: number): Observable<any> {
    return this.http.get(`${environment.API_URI}/ingresos/usuario/${id_usuario}`);
  }

  // Actualizar un egreso
  updateIngreso(id: number, ingresoData: any): Observable<any> {
    return this.http.put(`${environment.API_URI}/ingresos/${id}`, ingresoData);
  }

  // Eliminar un egreso
  deleteIngreso(id: number): Observable<any> {
    return this.http.delete(`${environment.API_URI}/ingresos/${id}`);
  }
}