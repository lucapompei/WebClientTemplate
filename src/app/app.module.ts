import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { LoggerService } from './services/logger/logger.service';
import { NetworkService } from './services/network/network.service';
import { StorageService } from './services/storage/storage.service';
import { AppRoutingModule } from './app-routing.module';
import { AppTranslateModule } from './app-translate.module';
import { EventBusService } from './services/event-bus/event-bus.service';
import { LoaderComponent } from './components/common/loader/loader.component';
import { HeaderComponent } from './components/menu/header/header.component';
import { FooterComponent } from './components/menu/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { PreLoginGuardService } from './guards/pre-login-guard.service';
import { PostLoginGuardService } from './guards/post-login-guard.service';
import { FormComponent } from './components/common/form/form.component';
import { AppMaterialModule } from './app-material.module';
import { HttpService } from './services/http/http.service';
import { RouterService } from './services/router/router.service';
import { SafeContentPipe } from './pipe/safe-content.pipe';
import { DialogHanlderComponent } from './components/common/dialog/dialog-handler.component';
import { DialogComponent } from './components/common/dialog/dialog.component';
import { HttpInterceptorService } from './services/http/http-interceptor.service';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AboutComponent,
    AppComponent,
    DialogComponent,
    DialogHanlderComponent,
    FormComponent,
    LoaderComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    SafeContentPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    AppRoutingModule,
    AppTranslateModule
  ],
  providers: [
    EventBusService,
    HttpService,
    LoggerService,
    NetworkService,
    RouterService,
    StorageService,
    PreLoginGuardService,
    PostLoginGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  entryComponents: [
    DialogComponent,
    DialogHanlderComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
