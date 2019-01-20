import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostLoginGuardService } from './guards/post-login-guard.service';
import { LoginComponent } from './components/login/login.component';
import { PreLoginGuardService } from './guards/pre-login-guard.service';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [PostLoginGuardService] },
  { path: 'login', component: LoginComponent, canActivate: [PreLoginGuardService] },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
