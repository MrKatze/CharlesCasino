import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UsuariosService } from '../../../services/usuarios.service';

@Component({
  selector: 'app-slot-machine',
  imports: [CommonModule],
  templateUrl: './tragaperras.component.html',
  styleUrls: ['./tragaperras.component.css']
})
export class TragaperrasComponent implements OnInit {
  private symbolHeight = 38;
  private totalSymbols = 8;
  private spins = 4;

  puntosActuales: number = 0;

  reels = [
    { positionY: 0, transition: 'none' },
    { positionY: 0, transition: 'none' },
    { positionY: 0, transition: 'none' }
  ];

  test = new Set<number>();

  constructor(private http: HttpClient, private router: Router, private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerPuntos();
  }

  obtenerPuntos(): void {
    const user = localStorage.getItem('id_usuario');
  
    if (user) {
      this.usuariosService.getUsuarioPuntos(user).subscribe({
        next: (response) => {
          const puntosData = Array.isArray(response) && response[0]?.[0]?.puntos ? response[0][0].puntos : 0;
          this.puntosActuales = parseInt(puntosData, 10);
        },
        error: (error) => {
          console.error('Error al obtener puntos:', error);
        },
      });
    } else {
      console.error('ID de usuario no encontrado.');
      this.router.navigate(['/login']);
    }
  }
  

  descontarPuntos(monto: number): void {
    const id_usuario = localStorage.getItem("id_usuario");
    const egresoData = {
      id_usuario: parseInt(id_usuario!, 10),
      monto: monto,
      metodo: 'apuesta_tragaperras',
      fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
      hora: new Date().toTimeString().slice(0, 8)
    };

    this.http.post('http://localhost:3000/api/egresos', egresoData).subscribe({
      next: () => {
        this.puntosActuales -= monto;
        console.log('Puntos descontados:', monto);
      },
      error: (error) => console.error('Error al descontar puntos:', error)
    });
  }

  agregarPuntos(monto: number): void {
    const id_usuario = localStorage.getItem("id_usuario");
    const ingresoData = {
      id_usuario: parseInt(id_usuario!, 10),
      monto: monto,
      metodo: 'ganancia_tragaperras',
      fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
      hora: new Date().toTimeString().slice(0, 8)
    };

    this.http.post('http://localhost:3000/api/ingresos', ingresoData).subscribe({
      next: () => {
        this.puntosActuales += monto;
        console.log('Puntos agregados:', monto);
      },
      error: (error) => console.error('Error al agregar puntos:', error)
    });
  }

  checkTargetIndex(targetIndex: number): void {
    const premios = [100, 200, 300, 400, 500, 600, 700, 800];
    const puntosGanados = premios[targetIndex] ?? 0;
    console.log(`Has ganado ${puntosGanados} puntos.`);
    this.agregarPuntos(puntosGanados);
  }

  spin(): void {
    if (this.puntosActuales < 10) {
      alert('Puntos insuficientes para girar.');
      return;
    }

    this.descontarPuntos(10);
    this.test.clear();

    this.reels.forEach((reel, index) => {
      reel.positionY = 0;
      const targetIndex = Math.floor(Math.random() * this.totalSymbols);
      const fullRotations = (this.spins + index) * this.totalSymbols;
      const finalPosition = -(fullRotations + targetIndex) * this.symbolHeight;

      setTimeout(() => {
        reel.positionY = finalPosition - (index * 8);
        reel.transition = 'transform 3s';
      }, index * 500);

      setTimeout(() => {
        reel.transition = 'none';
      }, 3000 + index * 500);

      this.test.add(targetIndex);
    });

    setTimeout(() => {
      if (this.test.size === 1) {
        this.checkTargetIndex(this.test.values().next().value as number);
      }
    }, 3500);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  irAPerfil() { this.router.navigate(['/account']); }
  
  irTiendaPuntos() { this.router.navigate(['/points_shop']); }
  
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
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
  irAnuncios() {
    this.router.navigate(['/anuncios']);  
  }
}
