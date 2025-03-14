import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule], 
  template: `
    <div class="container mt-4">
      <h2>Usuarios</h2>
      <ul>
        <li *ngFor="let user of users">{{ user.username }} - {{ user.correo }}</li>
      </ul>
      <button class="btn btn-primary" (click)="addUser()">Agregar Usuario</button>
    </div>
  `
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  users: any[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getUsuarios().subscribe(data => {
      this.users = data;
    });
  }

  addUser() {
    const newUser = { id_rol: 1, xp: 100, username: "Nuevo", correo: "nuevo@correo.com", password: "123456" };
    this.apiService.addUsuario(newUser).subscribe(() => {
      this.ngOnInit();
    });
  }

  
}

