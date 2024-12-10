import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService, private jwtHelper: JwtHelperService) { }

  isUserLoggedIn(){
    let tokens = this.getTokensFromLocalStorage();

    return tokens && tokens.accessToken;
  }

  isTokenValid(token: string | null) {
    if(token){
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
  
        return payload.exp && payload.exp > now;
      } catch (error) {
        console.error('Invalid token:', error);
        return false;
      }
    }
    return false;
  }

  getTokensFromLocalStorage(){
    if(typeof window !== 'undefined' && localStorage){
      let accessToken = localStorage.getItem('accessTokenToDoList');
      let refreshToken = localStorage.getItem('refreshTokenToDoList');

      if(this.isTokenValid(accessToken)){
        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
        }
      } 

      this.removeTokensFromLocalStorage();
      return null;
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

  decodeUserFromJwtToken(accessToken: string | null){
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
    if(this.isTokenValid(tokens.access_token)){
      localStorage.setItem('accessTokenToDoList', tokens.access_token);
      localStorage.setItem('refreshTokenToDoList', tokens.refresh_token);
    }
  }

  removeTokensFromLocalStorage(){
    localStorage.removeItem('accessTokenToDoList');
    localStorage.removeItem('refreshTokenToDoList');
  }
}
