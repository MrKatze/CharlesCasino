import { Component, OnInit } from '@angular/core';
import { BlackJackService } from '../../../services/blackjack.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { EgresosService } from '../../../services/egresos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class BlackJackComponent implements OnInit {
  constructor(
    private blackJackService: BlackJackService, 
    private usuariosService: UsuariosService,
    private egresosService: EgresosService,
    private router: Router
  ) {}

  puntosBalance: number = 0;
  puntosJuego: number = 0;
  puntosComputadora: number = 0;
  cartasJugador: string[] = [];
  cartasComputadora: string[] = [];
  juegoTerminado: boolean = false;
  mostrarModal: boolean = true;
  montoApuesta: number = 0;
  errorApuesta: string = '';

  ngOnInit(): void {
    this.cargarPuntosUsuario();
  }

  cargarPuntosUsuario(): void {
    const user = localStorage.getItem('id_usuario');
  
    if (user) {
      this.usuariosService.getUsuarioPuntos(user).subscribe({
        next: (response) => {
          const puntosData = Array.isArray(response) && response[0]?.[0]?.puntos ? response[0][0].puntos : 0;
          this.puntosBalance = parseInt(puntosData, 10);
        },
        error: (err) => {
          console.error('Error al obtener puntos del usuario:', err);
          this.errorApuesta = 'Error al cargar los puntos del jugador';
        }
      });
    } else {
      console.error('No se pudo obtener el ID del usuario');
      this.errorApuesta = 'Usuario no identificado';
      this.router.navigate(['/login']);
    }
  }

  validarApuesta(): boolean {
    if (!this.montoApuesta || this.montoApuesta <= 0) {
      this.errorApuesta = 'Debe ingresar un monto válido';
      return false;
    }
    
    if (this.montoApuesta > this.puntosBalance) {
      this.errorApuesta = 'No tienes suficientes puntos para esta apuesta';
      return false;
    }
    
    this.errorApuesta = '';
    return true;
  }

  iniciarJuego(): void {
    if (!this.validarApuesta()) return;

    const userId = localStorage.getItem('id_usuario');
    if (!userId) {
      this.errorApuesta = 'Usuario no identificado';
      return;
    }

    const egresoData = {
      id_usuario: parseInt(userId, 10),
      monto: this.montoApuesta,
      metodo: 'apuesta_blackjack',
      fecha: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    this.egresosService.createEgreso(egresoData).subscribe({
      next: () => {
        this.puntosBalance -= this.montoApuesta;
        this.mostrarModal = false;
        this.blackJackService.iniciarJuego();
        this.actualizarEstadoDesdeServicio();
        this.nuevoJuego();
      },
      error: (error) => {
        console.error('Error al registrar el egreso:', error);
        this.errorApuesta = 'Error al procesar la apuesta';
      }
    });
  }

  procesando: boolean = false;

  pedirCarta(): void {
    if (!this.juegoTerminado && !this.procesando) {
      this.procesando = true;
      try {
        if (!this.juegoTerminado) {
          try {
            const resultado = this.blackJackService.pedirCarta();
            this.actualizarEstadoDesdeServicio();
            
            if (this.puntosJuego > 21) {
              this.juegoTerminado = true;
              this.finalizarJuego();
            }
          } catch (error) {
            console.error('Error al pedir carta:', error);
          }
        }
      } finally {
        this.procesando = false;
      }
    }
  }
  

  detener(): void {
    if (!this.juegoTerminado) {
      this.juegoTerminado = true;
      this.finalizarJuego();
    }
  }
  
  private finalizarJuego(): void {
    this.blackJackService.turnoComputadora();
    this.determinarGanador();
    this.actualizarEstadoDesdeServicio();
    
    // Aquí puedes agregar lógica adicional para determinar el ganador
    console.log('Juego terminado', {
      jugador: this.puntosJuego,
      computadora: this.puntosComputadora
    });
  }

  nuevoJuego(): void {
    this.blackJackService.iniciarJuego();
    this.actualizarEstadoDesdeServicio();
    this.juegoTerminado = false;
    this.montoApuesta = 0;
  }

  private determinarGanador(): string {
    if (this.puntosJuego > 21) return 'computadora';
    if (this.puntosComputadora > 21) return 'jugador';
    if (this.puntosJuego > this.puntosComputadora) return 'jugador';
    if (this.puntosComputadora > this.puntosJuego) return 'computadora';
    return 'empate';
  }

  private actualizarEstadoDesdeServicio(): void {
    const estado = this.blackJackService.getEstadoJuego();
    this.cartasJugador = estado.cartasJugador;
    this.puntosJuego = estado.puntosJugador;
    this.cartasComputadora = estado.cartasComputadora;
    this.puntosComputadora = estado.puntosComputadora;
  }
}