import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TragaperrasComponent } from './pages/games/tragaperras/tragaperras.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'games/tragaperras', pathMatch: 'full', component:TragaperrasComponent },
  
];