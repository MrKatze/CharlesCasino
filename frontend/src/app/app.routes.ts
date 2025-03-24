import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; // Importa el DashboardComponent
import { RegisterComponent } from './pages/register/register.component';
import { TragaperrasComponent } from './pages/games/tragaperras/tragaperras.component';
import { RuletaComponent } from './pages/games/ruleta/ruleta.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'games/tragaperras', pathMatch: 'full', component:TragaperrasComponent },
  { path: 'games/ruleta', pathMatch: 'full', component:RuletaComponent },

];