import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PostLoginGuardService } from './guards/post-login-guard.service';
import { LoginComponent } from './components/login/login.component';
import { PreLoginGuardService } from './guards/pre-login-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [PreLoginGuardService] },
  { path: 'login', component: LoginComponent, canActivate: [PostLoginGuardService] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
