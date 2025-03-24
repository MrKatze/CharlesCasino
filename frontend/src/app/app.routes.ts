import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'; // Importa el DashboardComponent
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component'; // Importa el AccountComponent

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent }, 
  { path: 'account', component: AccountComponent }, 
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];