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

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
