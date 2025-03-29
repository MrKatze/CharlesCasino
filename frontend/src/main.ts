import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes'; // 📌 Debe importar las rutas
import { provideHttpClient } from '@angular/common/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), provideHttpClient() // 📌 Debe incluir provideRouter(routes)
  ]
});
import 'materialize-css/dist/js/materialize.min.js';
