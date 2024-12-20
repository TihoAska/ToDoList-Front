import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.backendUrl;

  constructor(
    private userService: UserService, 
    private jwtHelper: JwtHelperService, 
    private http: HttpClient,
    private router: Router
  ) { }

  isUserLoggedIn(){
    let accessToken = this.getAccessTokenFromLocalStorage();

    if(!accessToken){
      return false;
    }

    let user = this.decodeUserFromJwtToken(accessToken);
    return user.id && user.id != -1;
  }

  isAccessTokenValid(accessToken: any) {
    if(!accessToken){
      return false;
    }
    
    try{
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      
      return payload && payload.exp > now;
    } catch(e){
      return false;
    }
  }

  getTokensFromLocalStorage(){
    if(typeof window !== 'undefined' && localStorage){
      let accessToken = localStorage.getItem('accessTokenToDoList');
      let refreshToken = localStorage.getItem('refreshTokenToDoList');

      if(accessToken && refreshToken){
        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
      }
    }
    return null;
  }

  setUser(){
    let tokens = this.getTokensFromLocalStorage();

    if(tokens && tokens.accessToken){
      let user = this.decodeUserFromJwtToken(tokens.accessToken);
      this.userService.$loggedUser.next(user);
    }
  }

  removeUser(){
    this.userService.$loggedUser.next({
      id: -1,
    })
  }

  decodeUserFromJwtToken(accessToken: any){
    if(accessToken){
      let tokenPayload = this.jwtHelper.decodeToken(accessToken);
  
      let user = {
        id: tokenPayload['user_id'],
        username: tokenPayload['username'],
      }
  
      return user;
    }

    return {
      id: -1,
      username: '',
    }
  } 

  storeTokensToLocalStorage(tokens: any){
    if(this.isAccessTokenValid(tokens.access_token)){
      localStorage.setItem('accessTokenToDoList', tokens.access_token);
      localStorage.setItem('refreshTokenToDoList', tokens.refresh_token);
    }
  }

  removeTokensFromLocalStorage(){
    localStorage.removeItem('accessTokenToDoList');
    localStorage.removeItem('refreshTokenToDoList');
  }

  storeNewAccessToken(accessToken: any){
    if(this.isAccessTokenValid(accessToken)){
      localStorage.setItem('accessTokenToDoList', accessToken);
    }
  }

  getRefreshTokenFromLocalStorage(){
    return this.getTokensFromLocalStorage()?.refreshToken;
  }

  getAccessTokenFromLocalStorage(){
    return this.getTokensFromLocalStorage()?.accessToken;
  }

  isResponseValid(res: any){
    return res && Object.keys(res).length > 0;
  }

  logout(){
    this.removeTokensFromLocalStorage();
    this.removeUser();
    this.router.navigate(['login']);
  }

  refreshAccessToken(refreshToken: any){
    return this.http.post(this.backendUrl + 'api/token/refresh/', {
      refresh: refreshToken
    }).pipe(
      map((res: any) => {
        if(this.isResponseValid(res)){
          this.storeNewAccessToken(res.access);
          return of(true);
        }
        return of(false);
      }),
      catchError(() => {
        return of(false);
      })
    )
  }
}
