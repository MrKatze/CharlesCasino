import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Asegura que el componente sea standalone
  imports: [RouterModule], // 🔹 Importa el módulo de rutas
  template: `
    <div class="container">
      <h1></h1>
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CharlesCasino';
}
