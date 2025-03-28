import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(private router: Router) { }

  irAPerfil() {
    this.router.navigate(['/account']);
  }

  irTragaperras() {
    this.router.navigate(['/games/tragaperras']);
  }

  irRuleta() {
    this.router.navigate(['/games/ruleta']);
  }

  irTiendaPuntos() {
    this.router.navigate(['/points_shop']);

  }
  
  irABlackJack() {
    this.router.navigate(['/games/blackjack']);
  }
  irAnuncios() {
    this.router.navigate(['/anuncios']);  
  }
  
  logout(): void {
    // Eliminar los datos de la cuenta de anuncios vistos
    localStorage.removeItem('anunciosVistos');
    // Eliminar el token de autenticación
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de login
    this.router.navigate(['/login']);
  }

}
