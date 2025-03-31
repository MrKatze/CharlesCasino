import { Component, ElementRef, ViewChild } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { EgresosService } from '../../../services/egresos.service';
import { IngresosService } from '../../../services/ingresos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-roulette',
  templateUrl: './ruleta.component.html',
  styleUrls: ['./ruleta.component.css']
})
export class RuletaComponent {
  flips = 1;
  wheelNumbers: number[] = [
    0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36,
    13, 1, 0, 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4,
    23, 35, 14, 2
  ];
  numRed: number[] = [
    1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36
  ];
  numBlack: number[] = [
    15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26
  ];
  bets: number[] = [1, 5, 10, 50, 100, 500, 1000]
  option_selected: string = "No has seleccionado nada"
  number_selected: number = -1
  function_selected: Function = this.emptyFunction
  reward = 0
  result = false
  apuesta = 0
  wins = 0
  saldo = 0

  constructor(    private usuariosService: UsuariosService,
    private egresosService: EgresosService,
    private ingresosService: IngresosService,
    private router: Router) {
      this.cargarPuntosUsuario();
    }

  newGame() {
    if (!this.chekBet()) {
      return;
    }
    let index = this.getNumber()
    this.realizarApuesta();
    setTimeout(() => {
      // console.log(index, this.wheelNumbers[index])


      //CheckNumber
      this.checkNumber(this.wheelNumbers[index]);

      this.option_selected = "No has seleccionado nada"
      this.result = false
      this.function_selected = this.emptyFunction
      this.number_selected = -1
      this.reward = 0
      this.apuesta = 0

    }, 3500);
  }
  chekBet(){
    if(this.number_selected == -1 && this.function_selected == this.emptyFunction){
      alert("No has seleccionado ningun número o conjunto")
      return false
    }
    if(this.apuesta == 0){
      alert("No has realizado ninguna apuesta")
      return false
    }
    return true
  }
  checkNumber(index: number) {

    if (this.number_selected == -1) {
      this.result = this.function_selected(index)
    } else {
      this.result = (index == this.number_selected)
    }
    if (this.result) {
      this.wins = this.apuesta * this.reward
      alert("has ganado la apuesta, tu ganancia es: " + this.wins);
    }else{
      this.wins = 0
      alert("has perdido la apuesta");
    }
    this.pagarGanancia()

    // console.log(this.result, this.wins, this.apuesta, this.reward)
  }

  realizarApuesta() {
    const userId = localStorage.getItem('id_usuario');
    if (!userId) {
      return;
    }
    const egresoData = {
      id_usuario: parseInt(userId, 10),
      monto: this.apuesta,
      metodo: 'apuesta_ruleta',
      fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
      hora: new Date().toTimeString().slice(0, 8) // Agregar la hora en formato HH:mm:ss
    };
    this.egresosService.createEgreso(egresoData).subscribe({  
      next: (response) => {
        console.log('Egreso registrado exitosamente', response);
        this.saldo -= this.apuesta; // Actualizar el saldo después de la apuesta
      },
      error: (error) => {
        console.error('Error al registrar el egreso', error);
      },
    });
  }

  pagarGanancia() {
    const userId = localStorage.getItem('id_usuario');
    if (!userId) {
      return;
    } 
    const ingresoData = {
      id_usuario: parseInt(userId, 10),
      monto: this.wins,
      metodo: 'ganancia_ruleta',
      fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
      hora: new Date().toTimeString().slice(0, 8) // Agregar la hora en formato HH:mm:ss
    };
    this.ingresosService.createIngreso(ingresoData).subscribe({
      next: (response) => {
        console.log('Ingreso registrado exitosamente', response);
        this.saldo += this.wins; // Actualizar el saldo después de la ganancia
      },
      error: (error) => {
        console.error('Error al registrar el ingreso', error);
      },
    });
  }

  getNumber() {
    //SpinRoulette
    let ramdon = Math.floor(Math.random() * 38)
    let degree = (this.flips * 1080) + (360 / this.wheelNumbers.length) * ramdon
    this.rotateImage("myImage", degree)
    this.flips += 1;
    // console.log(ramdon, degree, this.wheelNumbers[ramdon]);
    return ramdon;
  }

  rotateImage(str: string, degrees: number) {
    let imageElement = document.getElementById(str);
    if (!imageElement) {
      // console.error("El elemento de imagen no es válido.");
      return;
    }
    // Asegúrate que la imagen tiene la clase para la transición
    imageElement.classList.add('rotating-image');
    imageElement.style.transform = `rotate(${-(degrees + 5)}deg)`;
  }
  isRed(n: number) {
    return (this.numRed.includes(n));
  }
  isBlack(n: number) {
    return (this.numBlack.includes(n));
  }
  isEven(n: number) {
    return (n % 2 == 0);
  }
  isOdd(n: number) {
    return (n % 2 == 1);
  }
  firstMiddle(n: number) {
    return (n >= 0 && n <= 18);
  }
  secondMiddle(n: number) {
    return (n >= 19 && n <= 36);
  }
  firstThree(n: number) {
    return (n >= 0 && n <= 12);
  }
  secondThree(n: number) {
    return (n >= 13 && n <= 24);
  }
  thridThree(n: number) {
    return (n >= 25 && n <= 36);
  }
  firstRow(n: number) {
    return n % 3 == 0
  }
  secondRow(n: number) {
    return (n + 1) % 3 == 0
  }
  thirdRow(n: number) {
    return (n + 2) % 3 == 0
  }

  isZero(n: number) {
    return n == 0
  }
  isDoubleZero(n: number) {
    return n == 19
  }
  addFunction(fun: Function) {
    this.function_selected = fun;
    this.number_selected = -1
    if (fun == this.isZero) {
      this.option_selected = "0";
      this.reward = 36
    }
    if (fun == this.isDoubleZero) {
      this.option_selected = "00";
      this.reward = 36
    }
    if (fun == this.firstRow) {
      this.option_selected = "3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36";
      this.reward = 3
    }
    if (fun == this.secondRow) {
      this.option_selected = "2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35";
      this.reward = 3
    }
    if (fun == this.thirdRow) {
      this.option_selected = "1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34 ";
      this.reward = 3
    }
    if (fun == this.isEven) {
      this.option_selected = "todos los numeros pares";
      this.reward = 2
    }
    if (fun == this.isOdd) {
      this.option_selected = "todos los numeros impares";
      this.reward = 2
    }
    if (fun == this.isRed) {
      this.option_selected = "todos los numeros rojos";
      this.reward = 2
    }
    if (fun == this.isBlack) {
      this.option_selected = "todos los numeros negros";
      this.reward = 2
    }
    if (fun == this.firstMiddle) {
      this.option_selected = "1 -18";
      this.reward = 2
    }
    if (fun == this.secondMiddle) {
      this.option_selected = "19 - 36";
      this.reward = 2
    }
    if (fun == this.firstThree) {
      this.option_selected = "1 - 12";
      this.reward = 3
    }
    if (fun == this.secondThree) {
      this.option_selected = "13 - 24";
      this.reward = 3
    }
    if (fun == this.thridThree) {
      this.option_selected = "25 - 36";
      this.reward = 3
    }

  }
  addNumber(n: number) {
    this.reward = 36
    this.number_selected = n;
    this.function_selected = this.emptyFunction
    this.option_selected = n.toString()
  }

  setBet(value: number) {
    if (value > this.saldo) {
      alert("No tienes suficiente saldo para esta apuesta.");
      return;
    }
    this.apuesta = value;
  }

  cargarPuntosUsuario(): void {
    const user = localStorage.getItem('id_usuario');
  
    if (user) {
      this.usuariosService.getUsuarioPuntos(user).subscribe({
        next: (response) => {
          const puntosData = Array.isArray(response) && response[0]?.[0]?.puntos ? response[0][0].puntos : 0;
          this.saldo = parseInt(puntosData, 10);
        },
        error: (err) => {
          console.error('Error al obtener puntos del usuario:', err);
        }
      });
    } else {
      console.error('No se pudo obtener el ID del usuario');
      this.router.navigate(['/login']);
    }
  }
  emptyFunction() {
    // Función vacía para evitar errores de referencia  
    // Puedes dejarla vacía o agregar un mensaje de error si lo prefieres
  }


}
