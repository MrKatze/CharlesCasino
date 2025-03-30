import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
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
  idUsuario: string | number |null = null;
  errordatos: string = ''; 
  username: string = '';
  correo: string = '';
  puntos: number = 0;
  idRol: number = 0;
  
  constructor(private usuarioservice:UsuariosService,private router: Router) { }
  
  ngOnInit() {
    const idUsuario = localStorage.getItem("id_usuario");
    this.idUsuario = Number(idUsuario);
    console.log("ID Usuario:", this.idUsuario);

    this.usuarioservice.getUsuarioDatos(this.idUsuario).subscribe({
      next: (response) => {
        this.username = response[0].username;  
        this.correo = response[0].correo;
        this.puntos = response[0].puntos;
        this.idRol = response[0].id_rol;
      },
      error: (err) => {
        console.error('Error al obtener puntos del usuario:', err);
        this.errordatos = 'Error al cargar los puntos del jugador';
      }
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  goToPerfil() {
    this.router.navigate(['/perfil']);
  }
  
  irTiendaPuntos() {
    this.router.navigate(['/points_shop']);
  }

  goToHistorial() {
    this.router.navigate(['/historial']);
  }

  irAnuncios() {
    this.router.navigate(['/anuncios']);  
  }

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
}
