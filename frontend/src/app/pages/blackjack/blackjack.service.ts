import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class BlackjackService {
  private deck: string[] = [];
  private tipos = ['C', 'D', 'H', 'S'];
  private especiales = ['A', 'J', 'Q', 'K'];

  constructor() {}

  iniciarJuego() {
    this.deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let tipo of this.tipos) {
        this.deck.push(i + tipo);
      }
    }
    for (let tipo of this.tipos) {
      for (let esp of this.especiales) {
        this.deck.push(esp + tipo);
      }
    }
    this.deck = _.shuffle(this.deck);
  }

  pedirCarta(): string {
    if (this.deck.length === 0) {
      throw 'No hay cartas en el deck';
    }
    return this.deck.pop()!;
  }

  valorCarta(carta: string): number {
    const valor = carta.substring(0, carta.length - 1);
    return isNaN(Number(valor)) ? (valor === 'A' ? 11 : 10) : Number(valor);
  }

  turnoComputadora(puntosMinimos: number): number {
    let puntosComputadora = 0;
    while (puntosComputadora < puntosMinimos && puntosComputadora <= 21) {
      const carta = this.pedirCarta();
      puntosComputadora += this.valorCarta(carta);
    }
    return puntosComputadora;
  }
}
