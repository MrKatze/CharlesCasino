import { Component, OnInit } from '@angular/core';
import { BlackjackService } from './blackjack.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css'],
  imports: [CommonModule],
})
export class BlackJackComponent implements OnInit {
  puntosJugador: number = 0;
  puntosComputadora: number = 0;
  cartasJugador: string[] = [];
  cartasComputadora: string[] = [];
  juegoTerminado: boolean = false;

  constructor(private blackjackService: BlackjackService) {}

  ngOnInit() {
    this.blackjackService.iniciarJuego();
  }

  pedirCarta() {
    if (!this.juegoTerminado) {
      const carta = this.blackjackService.pedirCarta();
      this.puntosJugador += this.blackjackService.valorCarta(carta);
      this.cartasJugador.push(carta);

      if (this.puntosJugador > 21) {
        this.juegoTerminado = true;
        this.blackjackService.turnoComputadora(this.puntosJugador);
      }
    }
  }

  detener() {
    this.juegoTerminado = true;
    this.blackjackService.turnoComputadora(this.puntosJugador);
  }

  nuevoJuego() {
    this.puntosJugador = 0;
    this.puntosComputadora = 0;
    this.cartasJugador = [];
    this.cartasComputadora = [];
    this.juegoTerminado = false;
    this.blackjackService.iniciarJuego();
  }
}
