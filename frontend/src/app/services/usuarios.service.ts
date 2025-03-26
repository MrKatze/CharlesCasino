import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  
  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any> {
    return this.http.get(`${environment.API_URI}/usuario/usuarios`);
  }

  addUsuario(usuario: any): Observable<any> {
    return this.http.post(`${environment.API_URI}/createUsuario`, usuario);
  }

  getUsuarioPuntos(id_usuario: string): Observable<any> {
    return this.http.get(`${environment.API_URI}/usuario/puntos/${id_usuario}`);
  }

  login(userData: any) {
    return this.http.post<{ token: string }>('http://localhost:3000/api/login', userData);
  }
}
