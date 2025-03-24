import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BlackJackComponent } from './pages/blackjack/blackjack.component';
//import { RouletteComponent } from './pages/roulette/roulette.component';
//import { SlotsComponent } from './pages/slots/slots.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'index', component: DashboardComponent }, // La página principal
  { path: 'blackjack', component: BlackJackComponent },
 // { path: 'Roulette', component: RouletteComponent },
// { path: 'Slots', component: SlotsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/index' } // Redirige cualquier ruta desconocida a index
];
