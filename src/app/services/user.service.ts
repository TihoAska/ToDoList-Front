import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BACKEND_URL } from './tokens';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  $loggedUser: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
    @Inject(BACKEND_URL) private backendUrl: string,
    private http: HttpClient,
    public jwtHelper: JwtHelperService
  ) {
  }

  login(user: any){
    return this.http.post(this.backendUrl + 'api/user/login/', user);
  }

  register(user: any){
    return this.http.post(this.backendUrl + 'api/user/register/', user);
  }

  forgotPassword(email: any){
    return this.http.post(this.backendUrl + 'api/user/forgot-password/', email);
  }
}
