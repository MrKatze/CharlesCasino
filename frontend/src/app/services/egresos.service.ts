import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EgresosService {
  
  constructor(private http: HttpClient) {}

  // Obtener todos los egresos
  getEgresos(): Observable<any> {
    return this.http.get(`${environment.API_URI}/egresos`);
  }

  // Crear un nuevo egreso
  createEgreso(egresoData: any): Observable<any> {
    return this.http.post(`${environment.API_URI}/egresos`, egresoData);
  }

  // Obtener un egreso por ID
  getEgresoById(id: number): Observable<any> {
    return this.http.get(`${environment.API_URI}/egresos/${id}`);
  }

  // Obtener egresos por ID de usuario
  getEgresosByUsuario(id_usuario: number): Observable<any> {
    return this.http.get(`${environment.API_URI}/egresos/usuario/${id_usuario}`);
  }

  // Actualizar un egreso
  updateEgreso(id: number, egresoData: any): Observable<any> {
    return this.http.put(`${environment.API_URI}/egresos/${id}`, egresoData);
  }

  // Eliminar un egreso
  deleteEgreso(id: number): Observable<any> {
    return this.http.delete(`${environment.API_URI}/egresos/${id}`);
  }
}