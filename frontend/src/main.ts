import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // 📌 Debe importar las rutas

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes) // 📌 Debe incluir provideRouter(routes)
  ]
});
import 'materialize-css/dist/js/materialize.min.js';
