import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';

@Component({
  selector: 'app-tragaperras',
  imports: [],
  templateUrl: './tragaperras.component.html',
  styleUrl: './tragaperras.component.css'
})


export class TragaperrasComponent {
  @ViewChild('slotCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  
  // Símbolos del juego
  //private sprite: HTMLImageElement = new Image()
  private symbols: string[] = ['🍒', '🍋', '🍉', '🔔', '⭐'];
  private reels: string[][] = [[], [], []];
  private isSpinning: boolean = false;
  public  frutas  = 'src/assets/tragaperras/fruits.png'


  ngOnInit(){
    
  }
  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    if (!this.ctx) {
      console.error('Error: No se pudo obtener el contexto 2D del canvas.');
      return;
    }
    this.draw();

    
  }
  draw():void{
    // this.ctx.drawImage(Icons.getFruits(), 0, 0, 100, 100, 300, 300)
    this.ctx.drawImage(Icons.getFruits(), 0, 0,  400,400 );

  }
}

class Icons {
  private fruit_img:HTMLImageElement = new Image()
  static getFruits: any;
  
  Constructor():void{
    
    this.fruit_img.src = '/src/assets/tragaperras/fruits.png'
  }
  public getFruits(){
    return this.fruit_img
  }

}

export class SpriteManager {
  private sprite: HTMLImageElement;
  private symbolWidth: number;
  private symbolHeight: number;

  constructor(spritePath: string, symbolWidth: number, symbolHeight: number) {
      this.sprite = new Image();
      this.sprite.src = spritePath;

      this.symbolWidth = symbolWidth;
      this.symbolHeight = symbolHeight;
  }

  // Esperar a que el sprite cargue antes de dibujar
  async load(): Promise<void> {
      return new Promise((resolve, reject) => {
          this.sprite.onload = () => resolve();
          this.sprite.onerror = (error) => reject(`Error al cargar el sprite: ${error}`);
      });
  }

  // Dibujar un símbolo específico en el Canvas
  drawSymbol(
      ctx: CanvasRenderingContext2D, 
      symbolIndex: number, 
      x: number, 
      y: number
  ): void {
      ctx.drawImage(
          this.sprite,
          symbolIndex * this.symbolWidth, 0,   // Coordenadas del símbolo dentro del sprite
          this.symbolWidth, this.symbolHeight, // Tamaño del símbolo
          x, y,                                // Posición en el canvas
          this.symbolWidth, this.symbolHeight  // Escala en el canvas
      );
  }
}