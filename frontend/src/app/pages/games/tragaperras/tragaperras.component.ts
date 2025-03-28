import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-slot-machine',
  imports: [CommonModule],
  templateUrl: './tragaperras.component.html',
  styleUrls: ['./tragaperras.component.css']
})
export class TragaperrasComponent {
  private symbolHeight = 38;
  private totalSymbols = 8;
  private spins = 4;
  reels = [
    { positionY: 0, transition: 'none' },
    { positionY: 0, transition: 'none' },
    { positionY: 0, transition: 'none' }
  ];
  router: any;
  test = new Set();
  updatePuntos: any;

  constructor(private http: HttpClient) { }

  setPuntos(puntos: number) {
    console.log("Puntos actualizados");
    this.http.get(`http://localhost:3000/api/usuario/getPointsByID/${localStorage.getItem("id_usuario")}`).subscribe({
      next: (response: any) => {
        console.log('Puntos actuales', response);
        this.updatePuntos(response[0].puntos + puntos);
        this.http.put(`http://localhost:3000/api/usuario/updatePointsByID/${localStorage.getItem("id_usuario")}`, { puntos: this.updatePuntos }).subscribe({
          next: (response: any) => {
            console.log('Puntos actualizados', response);
          },
          error: (error) => {
            console.error('Error al actualizar puntos', error);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener puntos', error);
      }
    });
  }

  checkTargetIndex(targetIndex: number) {
    console.log("checkTargetIndex:", targetIndex);
    switch(targetIndex){
      case 0:
        console.log("Has ganado 100 puntos");
        this.setPuntos(100);
        break;
      case 1:
        console.log("Has ganado 200 puntos");
        this.setPuntos(200);
        break;
      case 2:
        console.log("Has ganado 300 puntos");
        this.setPuntos(300);
        break;
      case 3:
        console.log("Has ganado 400 puntos");
        this.setPuntos(400);
        break;
      case 4:
        console.log("Has ganado 500 puntos");
        this.setPuntos(500);
        break;
      case 5:
        console.log("Has ganado 600 puntos");
        this.setPuntos(600);
        break;
      case 6:
        console.log("Has ganado 700 puntos");
        this.setPuntos(700);
        break;
      case 7:
        console.log("Has ganado 800 puntos");
        this.setPuntos(800);
        break;
    }
  }

  spin() {
    this.test.clear();
    this.reels.forEach((reel, index) => {
      reel.positionY = 0
      const targetIndex = Math.floor(Math.random() * this.totalSymbols);
      const fullRotations = (this.spins + index) * this.totalSymbols;
      const finalPosition = -(fullRotations + targetIndex) * this.symbolHeight;

      const frutas = ["naranja", "sandia", "coco", "campana", "pera", "bar",
         "siete", "cereza"]
      console.log("Has sacado ",
        index, frutas[targetIndex], fullRotations, finalPosition, -targetIndex * 
        this.symbolHeight)
        this.test.add(targetIndex)

      setTimeout(() => {
        reel.positionY = finalPosition - (index * 8);
        // reel.positionY = -targetIndex * this.symbolHeight;
        reel.transition = 'transform 3s ';
      }, index * 500);

      setTimeout(() => {
        reel.transition = 'none';
        // reel.positionY = -targetIndex * this.symbolHeight;
      }, 3000 + index * 500);
    });

    console.log(this.test)
    if (this.test.size == 1) {
      console.log("Has ganado");
      this.checkTargetIndex(this.test.values().next().value as number);
    }
  }

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

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
