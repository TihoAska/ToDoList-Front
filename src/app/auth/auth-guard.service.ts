import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services/user.service';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isUserLoggedIn()){
      return true;
    } else{
      let refreshToken = this.authService.getRefreshTokenFromLocalStorage();

      if(!refreshToken){
        this.authService.logout();
        return false;
      }

      return this.authService.refreshAccessToken(refreshToken).pipe(
        map((isRefreshed) => {
          if(isRefreshed){
            return true;
          } else{
            this.authService.logout();
            return false;
          }
        })
      )
    }
  }
}
