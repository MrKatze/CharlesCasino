import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; // Importa el DashboardComponent
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component'; // Importa el AccountComponent
import { TragaperrasComponent } from './pages/games/tragaperras/tragaperras.component';
import { RuletaComponent } from './pages/games/ruleta/ruleta.component';
import { PointsShopComponent } from './pages/points-shop/points-shop.component';
import { BlackJackComponent } from './pages/games/blackjack/blackjack.component'; // Importa el BlackJackComponent
import { AnunciosComponent } from './pages/anuncios/anuncios.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent }, 
  { path: 'account', component: AccountComponent }, 
  { path: 'anuncios', component: AnunciosComponent },
  { path: 'games/blackjack', pathMatch: 'full', component:BlackJackComponent },
  { path: 'games/tragaperras', pathMatch: 'full', component:TragaperrasComponent },
  { path: 'games/ruleta', pathMatch: 'full', component:RuletaComponent },
  { path: 'points_shop', pathMatch: 'full', component: PointsShopComponent},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];