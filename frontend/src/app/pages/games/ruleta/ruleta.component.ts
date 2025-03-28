import { Component, ElementRef, ViewChild } from '@angular/core';

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
  optionSelect?: Function[] =[];
  target = -1
  select:string  = ""
  constructor() {
  }
  newGame(){
    let index = this.getNumber()
    setTimeout(() => {
      console.log(this.isBlack(index),this.wheelNumbers[index])
      //CheckNumber
      this.checkNumber(index);
      
    }, 3500);
  }
  checkNumber(index:number){
    
  }

  getNumber() {
    //SpinRoulette
    let ramdon = Math.floor(Math.random() * 38)
    let degree = (this.flips*1080) + (360 / this.wheelNumbers.length) * ramdon
    this.rotateImage("myImage",degree)
    this.flips+=1;
    // console.log(ramdon, degree, this.wheelNumbers[ramdon]);
    return ramdon; 
  }

  rotateImage(str: string, degrees: number) {
    let imageElement = document.getElementById(str);
    if (!imageElement) {
      console.error("El elemento de imagen no es válido.");
      return;
    }
    // Asegúrate que la imagen tiene la clase para la transición
    imageElement.classList.add('rotating-image');
    imageElement.style.transform = `rotate(${-(degrees+5)}deg)`;
  }
  isRed(n:number){
    return (this.numRed.includes(this.wheelNumbers[n]));
  }
  isBlack(n:number){
    return (this.numBlack.includes(this.wheelNumbers[n]));
  }
  isEven(n:number){
    return (n%2==0);
  }
  firstMiddle(n:number){
    return (n>=0 && n<=18);
  }
  secondMiddle(n:number){
    return (n>=19 && n<=36);
  }
  firstThree(n:number){
    return (n>=0 && n<=12);
  }
  secondThree(n:number){
    return (n>=13 && n<=24);
  }
  ThridThree(n:number){
    return (n>=25 && n<=36);
  }
  isZero(n:number){
    return n ==0
  }
  isDoubleZero(n:number){
    return n==19
  }
  addFunction(fun:Function){
    this.optionSelect?.push(fun);
    console.log(this.optionSelect)
  }
}
