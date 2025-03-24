import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-slot-machine',
  imports: [CommonModule], // Asegura que CommonModule está importado
  templateUrl:'./tragaperras.component.html',
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

  spin() {
    this.reels.forEach((reel, index) => {
      reel.positionY=0
      const targetIndex = Math.floor(Math.random() * this.totalSymbols);
      const fullRotations = (this.spins + index) * this.totalSymbols;
      const finalPosition = -(fullRotations + targetIndex) * this.symbolHeight ;
      
      const frutas = ["naranja", "sandia", "coco", "campana", "pera", "bar", "siete", "cereza"]
      console.log("Has sacado ",index, frutas[targetIndex],fullRotations, finalPosition, -targetIndex * this.symbolHeight)

      setTimeout(() => {
        reel.positionY = finalPosition-(index*8);
        // reel.positionY = -targetIndex * this.symbolHeight;
        reel.transition = 'transform 3s ';
      }, index * 500);
      
      setTimeout(() => {
        reel.transition = 'none';
        // reel.positionY = -targetIndex * this.symbolHeight;
      }, 3000 + index * 500);
    });
  }
}
