import { Component, OnInit } from '@angular/core';
import { BlackJackService } from '../../../services/blackjack.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { EgresosService } from '../../../services/egresos.service';
import { IngresosService } from '../../../services/ingresos.service';
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
    private ingresosService: IngresosService,
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
  procesando: boolean = false;
  mensajeResultado: string = '';
  mostrarResultado: boolean = false; // Controla la visibilidad del modal de resultado
  private audio: HTMLAudioElement | null = typeof Audio !== 'undefined' ? new Audio() : null;

  ngOnInit(): void {
    this.cargarPuntosUsuario();
  }

  cargarPuntosUsuario(): void {
    if (typeof localStorage === 'undefined') {
      console.error('localStorage no está disponible en este entorno.');
      this.errorApuesta = 'No se pudo cargar la información del usuario.';
      return;
    }

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
  
    const userId = typeof localStorage !== 'undefined' ? localStorage.getItem('id_usuario') : null;
    if (!userId) {
      this.errorApuesta = 'Usuario no identificado';
      return;
    }
  
    const egresoData = {
      id_usuario: parseInt(userId, 10),
      monto: this.montoApuesta,
      metodo: 'apuesta_blackjack',
      fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
      hora: new Date().toTimeString().slice(0, 8) // Agregar la hora en formato HH:mm:ss
    };
  
    this.egresosService.createEgreso(egresoData).subscribe({
      next: () => {
        this.puntosBalance -= this.montoApuesta;
        this.mostrarModal = false; // Ocultar el modal
        this.blackJackService.iniciarJuego();
        this.actualizarEstadoDesdeServicio();
      },
      error: (error) => {
        console.error('Error al registrar el egreso:', error);
        this.errorApuesta = 'Error al procesar la apuesta';
      }
    });
  }

  reproducirSonido(ruta: string): void {
    if (this.audio) {
      this.audio.src = ruta;
      this.audio.load();
      this.audio.play().catch((error) => {
        console.error('Error al reproducir el sonido:', error);
      });
    } else {
      console.warn('El objeto Audio no está disponible en este entorno.');
    }
  }

  pedirCarta(): void {
    if (!this.juegoTerminado && !this.procesando) {
      this.procesando = true;
      try {
        if (!this.juegoTerminado) {
          try {
            this.reproducirSonido('/assets/sonidos/card_draw.mp3'); // Sonido al pedir carta
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
    this.procesando = false;
    this.finalizarJuego();
    
    if (!this.juegoTerminado) {
      this.juegoTerminado = true;
      
      this.reproducirSonido('assets/sonidos/stop.mp3'); // Sonido al detener
    }
  }
  
  private finalizarJuego(): void {
    const resultadoComputadora = this.blackJackService.turnoComputadora();
    this.puntosComputadora = resultadoComputadora.puntos;
    this.cartasComputadora = resultadoComputadora.cartas;
    const ganador = this.determinarGanador(this.puntosJuego, this.puntosComputadora); // Determinar el ganador
    this.actualizarEstadoDesdeServicio();

    // Mostrar mensaje de resultado
    if (ganador === 'jugador') {
      this.mensajeResultado = '¡Felicidades! Ganaste el juego.';

      const userId = typeof localStorage !== 'undefined' ? localStorage.getItem('id_usuario') : null;
      if (!userId) {
        this.errorApuesta = 'Usuario no identificado';
        return;
      }

      const ingresoData = {
        id_usuario: parseInt(userId, 10),
        monto: this.montoApuesta * 2, // Ganancia del jugador
        metodo: 'apuesta_blackjack',
        fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
        hora: new Date().toTimeString().slice(0, 8) // Agregar la hora en formato HH:mm:ss
      };

      this.ingresosService.createIngreso(ingresoData).subscribe({
        next: () => {
          this.puntosBalance += ingresoData.monto; // Actualizar balance del jugador
        },
        error: (error) => {
          console.error('Error al registrar el ingreso:', error);
          this.errorApuesta = 'Error al procesar la ganancia';
        }
      });

    } else if (ganador === 'computadora') {
      this.mensajeResultado = 'Lo siento, perdiste contra la computadora.';
      // No se realiza ningún ingreso ni modificación del balance en este caso

    } else if (ganador === 'empate') {
      this.mensajeResultado = 'Es un empate.';

      const userId = typeof localStorage !== 'undefined' ? localStorage.getItem('id_usuario') : null;
      if (!userId) {
        this.errorApuesta = 'Usuario no identificado';
        return;
      }

      const ingresoData = {
        id_usuario: parseInt(userId, 10),
        monto: this.montoApuesta, // Devolver la apuesta al jugador
        metodo: 'apuesta_blackjack_empate',
        fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
        hora: new Date().toTimeString().slice(0, 8) // Agregar la hora en formato HH:mm:ss
      };

      this.ingresosService.createIngreso(ingresoData).subscribe({
        next: () => {
          this.puntosBalance += ingresoData.monto; // Devolver la apuesta al balance
        },
        error: (error) => {
          console.error('Error al registrar el ingreso por empate:', error);
          this.errorApuesta = 'Error al procesar el empate';
        }
      });
    }

    // Reproducir sonido según el resultado
    

    this.mostrarResultado = true; // Mostrar el modal de resultado

    console.log('Juego terminado', {
      jugador: this.puntosJuego,
      computadora: this.puntosComputadora,
      resultado: this.mensajeResultado
    });
  }

  

  cerrarModalResultado(): void {
    this.mostrarResultado = false; // Ocultar el modal de resultado
    if (this.mensajeResultado.includes('Ganaste')) {
      this.reproducirSonido('assets/sonidos/win.mp3'); // Sonido de victoria
    } else if (this.mensajeResultado.includes('perdiste')) {
      this.reproducirSonido('assets/sonidos/lose.mp3'); // Sonido de derrota
    } else if (this.mensajeResultado.includes('empate')) {
      this.reproducirSonido('assets/sonidos/draw.mp3'); // Sonido de empate
    }
  }

  nuevoJuego(): void {
    this.reproducirSonido('assets/sonidos/card_shuffle.mp3'); // Sonido al iniciar un nuevo juego
    this.mostrarModal = true; // Abrir el modal para ingresar un nuevo monto de apuesta
    this.puntosJuego = 0; // Reiniciar puntos del jugador
    this.puntosComputadora = 0; // Reiniciar puntos de la computadora
    this.cartasJugador = []; // Reiniciar cartas del jugador
    this.cartasComputadora = []; // Reiniciar cartas de la computadora
    this.juegoTerminado = false; // Reiniciar estado del juego
    this.mensajeResultado = ''; // Limpiar el mensaje de resultado
    this.montoApuesta = 0;
  }

  private determinarGanador(puntosJuego: number, puntosComputadora: number): string {
    // Si el jugador se pasa de 21, la computadora gana
    if (puntosJuego > 21) {
      return 'computadora';
    }
  
    // Si la computadora se pasa de 21, el jugador gana
    if (puntosComputadora > 21) {
      return 'jugador';
    }
  
    // Si ambos tienen puntajes válidos, gana quien esté más cerca de 21
    if (puntosComputadora > puntosJuego) {
      return 'computadora';
    }
  
    if (puntosJuego > puntosComputadora) {
      return 'jugador';
    }
  
    // Si ambos tienen el mismo puntaje, es un empate
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