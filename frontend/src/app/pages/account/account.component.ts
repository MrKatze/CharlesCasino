import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  nombreUsuario: string = 'Usuario de Ejemplo';
  correoUsuario: string = 'usuario@example.com';

  constructor(private router: Router) { }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  goToPerfil() {
    this.router.navigate(['/perfil']);
  }
  
  goToHistorial() {
    this.router.navigate(['/historial']);
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
