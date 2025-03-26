import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  login(userData: any) {
    return this.http.post<{ token: string }>('http://localhost:3000/api/login', userData);
  }
}
