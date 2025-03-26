import { Injectable } from '@angular/core';
import * as _ from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class BlackJackService {
  private deck: string[] = [];
  private tipos = ['C', 'D', 'H', 'S']; // Corazones, Diamantes, Picas, Tréboles
  private especiales = ['A', 'J', 'Q', 'K'];
  
  // Nuevas propiedades para mantener el estado
  private cartasComputadora: string[] = [];
  private puntosComputadora: number = 0;
  private cartasJugador: string[] = [];
  private puntosJugador: number = 0;

  constructor() {}

  // Inicializa el juego y limpia estados anteriores
  iniciarJuego() {
    this.crearDeck();
    this.cartasComputadora = [];
    this.puntosComputadora = 0;
    this.cartasJugador = [];
    this.puntosJugador = 0;
  }

  private crearDeck() {
    this.deck = [];
    // Cartas numéricas
    for (let i = 2; i <= 10; i++) {
      for (let tipo of this.tipos) {
        this.deck.push(i + tipo);
      }
    }
    // Cartas especiales
    for (let tipo of this.tipos) {
      for (let esp of this.especiales) {
        this.deck.push(esp + tipo);
      }
    }
    this.deck = _.shuffle(this.deck);
  }

  // Jugador pide carta
  pedirCarta(): { carta: string, puntos: number } {
    if (this.deck.length === 0) {
      throw new Error('No hay cartas en el deck');
    }
    
    const carta = this.deck.pop()!;
    this.cartasJugador.push(carta);
    this.puntosJugador += this.valorCarta(carta);
    
    return { carta, puntos: this.puntosJugador };
  }

  // Calcula valor de la carta
  valorCarta(carta: string): number {
    const valor = carta.substring(0, carta.length - 1);
    return isNaN(Number(valor)) ? (valor === 'A' ? 11 : 10) : Number(valor);
  }

  // Turno de la computadora
  turnoComputadora(): { cartas: string[], puntos: number } {
    while (this.puntosComputadora < this.puntosJugador && this.puntosComputadora <= 21) {
      const carta = this.pedirCartaComputadora();
      this.puntosComputadora += this.valorCarta(carta);
    }
    return { cartas: this.cartasComputadora, puntos: this.puntosComputadora };
  }

  // Método privado para que la computadora pida carta
  private pedirCartaComputadora(): string {
    if (this.deck.length === 0) {
      throw new Error('No hay cartas en el deck');
    }
    const carta = this.deck.pop()!;
    this.cartasComputadora.push(carta);
    return carta;
  }

  // Métodos para obtener estado actual
  getEstadoJuego() {
    return {
      cartasJugador: [...this.cartasJugador],
      puntosJugador: this.puntosJugador,
      cartasComputadora: [...this.cartasComputadora],
      puntosComputadora: this.puntosComputadora
    };
  }

  

}