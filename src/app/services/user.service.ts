import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  backendUrl = environment.backendUrl;

  $loggedUser: BehaviorSubject<any> = new BehaviorSubject<any>({});

  constructor(
    private http: HttpClient,
    public jwtHelper: JwtHelperService){

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
