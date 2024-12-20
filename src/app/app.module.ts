import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';
import { CreateComponent } from './components/create/create.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { tokenInterceptor } from './auth/token.interceptor';
import { environment } from 'src/environments/environment';
import { BACKEND_URL } from './services/tokens';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MainComponent,
    HomeComponent,
    CreateComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([tokenInterceptor])),
    provideAnimationsAsync(),
    { 
      provide: JWT_OPTIONS, 
      useValue: JWT_OPTIONS
    },
    { provide: BACKEND_URL, useValue: environment.backendUrl },
    JwtHelperService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
