import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { IngresosService } from '../../services/ingresos.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-anuncios',
    templateUrl: './anuncios.component.html',
    styleUrls: ['./anuncios.component.css'],
    imports: [CommonModule] // Agrega CommonModule aquí
})
export class AnunciosComponent {
    @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef; // Referencia al reproductor de video
    tiempoActual: number = 0;
    botonHabilitado: boolean = false;
    progreso: number = 0; // Variable para habilitar/deshabilitar el botón
    maxAnunciosPorDia: number = 4; // Máximo de anuncios permitidos por día
    anunciosVistosHoy: number = 0; // Contador de anuncios vistos hoy
    controlesHabilitados: boolean = false; // Variable para habilitar/deshabilitar los controles del video

    constructor(private ingresosService: IngresosService, private router: Router) {
        this.verificarAnunciosVistos();
    }

    // Verificar cuántos anuncios ha visto el usuario hoy
    verificarAnunciosVistos(): void {
        const fechaHoy = new Date().toISOString().slice(0, 10); // Fecha actual en formato YYYY-MM-DD
        const datosAnuncios = JSON.parse(localStorage.getItem('anunciosVistos') || '{}');

        if (datosAnuncios.fecha === fechaHoy) {
            this.anunciosVistosHoy = datosAnuncios.contador || 0;
        } else {
            // Reiniciar el contador si es un nuevo día
            this.anunciosVistosHoy = 0;
            localStorage.setItem('anunciosVistos', JSON.stringify({ fecha: fechaHoy, contador: 0 }));
        }
    }

    // Incrementar el contador de anuncios vistos
    incrementarAnunciosVistos(): void {
        const fechaHoy = new Date().toISOString().slice(0, 10);
        this.anunciosVistosHoy++;
        localStorage.setItem('anunciosVistos', JSON.stringify({ fecha: fechaHoy, contador: this.anunciosVistosHoy }));
    }

    // Método para otorgar recompensa al usuario
    otorgarRecompensa(): void {
        const userId = typeof localStorage !== 'undefined' ? localStorage.getItem('id_usuario') : null;

        if (!userId) {
            alert('Usuario no identificado. Por favor, inicia sesión.');
            return;
        }

        const ingresoData = {
            id_usuario: parseInt(userId, 10),
            monto: 12, // Recompensa de 45 monedas
            metodo: 'ver_anuncio',
            fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
            hora: new Date().toTimeString().slice(0, 8)
        };

        this.ingresosService.createIngreso(ingresoData).subscribe({
            next: (response) => {
                console.log('Recompensa otorgada:', response);
                this.incrementarAnunciosVistos(); // Incrementar el contador de anuncios vistos
                if (confirm('¡Recompensa de 12 monedas otorgada con éxito! ¿Deseas volver al dashboard?')) {
                    this.router.navigate(['/dashboard']); // Redirige al dashboard
                }
            },
            error: (error) => {
                console.error('Error al otorgar recompensa:', error);
                alert('Hubo un problema al otorgar la recompensa.');
            }
        });
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

    irABlackJack() {
        this.router.navigate(['/games/blackjack']);
    }
    irAnuncios() {
        this.router.navigate(['/anuncios']);
    }


    bloquearAdelanto(event: Event): void {
        const videoElement = event.target as HTMLVideoElement;

        // Permitir que el video continúe reproduciéndose, pero evitar que el usuario lo adelante
        if (videoElement.currentTime > this.tiempoActual + 1) { // Permitir un margen de 1 segundo
            videoElement.currentTime = this.tiempoActual;
        }

        // Actualizar el tiempo actual mientras el video se reproduce
        this.tiempoActual = videoElement.currentTime;
    }

    actualizarProgreso(video: HTMLVideoElement): void {
        this.progreso = (video.currentTime / video.duration) * 100;

        // Habilitar los controles cuando se haya reproducido el 10% del video
        if (this.progreso >= 10) {
            this.controlesHabilitados = true;
        }

        // Habilitar el botón "Ir al Final" cuando se haya reproducido el 80% del video
        if (this.progreso >= 80) {
            this.botonHabilitado = true;
        }
    }

    irAlFinal(videoElement: HTMLVideoElement): void {
        // Llevar el video al final
        videoElement.currentTime = videoElement.duration; // Salta al final del video
    }

    finalizarVideo(): void {
        console.log('El anuncio ha finalizado.');
        this.otorgarRecompensa(); // Llama al método para otorgar la recompensa
    }

    // Verificar si el usuario puede ver más anuncios
    puedeVerAnuncio(): boolean {
        return this.anunciosVistosHoy < this.maxAnunciosPorDia;
    }

    logout(): void {
        // Eliminar los datos de la cuenta de anuncios vistos
        localStorage.removeItem('anunciosVistos');
        // Eliminar el token de autenticación
        localStorage.removeItem('token');
        // Redirigir al usuario a la página de login
        this.router.navigate(['/login']);
      }
}
