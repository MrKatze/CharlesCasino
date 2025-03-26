import { CommonModule } from '@angular/common';  // Agrega esto
import { ReactiveFormsModule } from '@angular/forms';  // Agrega esto
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true, // Si tu componente es standalone, debes incluir esto
  imports: [CommonModule, ReactiveFormsModule], // Agrega CommonModule y ReactiveFormsModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  LogoURL: string = "assets/images/logo.jpeg";
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  irARegistro() {
    this.router.navigate(['/register']);
  }

  login() {
    if (this.loginForm.valid) {
      // Enviar los datos al backend
      this.http.post('http://localhost:3000/api/usuario/login', this.loginForm.value).subscribe({
        next: (response: any) => { // Especifica el tipo 'any' para acceder a las propiedades del objeto
          console.log('Login exitoso', response);
          
          // Almacenar el token y el id_usuario en el localStorage
          localStorage.setItem('token', 'fake-token'); // Puedes almacenar un token real
          localStorage.setItem('id_usuario', response.id_usuario); // Guarda el id_usuario del response
          
          this.router.navigate(['/dashboard']); // Redirigir al dashboard después del login
        },
        error: (error) => {
          console.error('Error en el login', error);
          this.errorMessage = 'Credenciales incorrectas';
        },
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos';
    }
  }
}
