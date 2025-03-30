import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-points-shop',
  imports: [],
  templateUrl: './points-shop.component.html',
  styleUrl: './points-shop.component.css'
})
export class PointsShopComponent {
  constructor(private router: Router) { }
  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
  irAPerfil() {
    this.router.navigate(['/account']);
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

  irTragaperras() {
    this.router.navigate(['/games/tragaperras']);
  }

  irRuleta() {
    this.router.navigate(['/games/ruleta']);
  }
  
  irABlackJack() {
    this.router.navigate(['/games/blackjack']);
  }

}
