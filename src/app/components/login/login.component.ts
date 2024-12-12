import { UserService } from './../../services/user.service';
import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  showError = false;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {

  }

  login(){
    if(this.loginForm.valid){
      this.userService.login({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      }).subscribe({
        next: (res: any) => {
          if(this.isResponseValid(res)){
            this.authService.storeTokensToLocalStorage(res);
            this.authService.setUser();
            this.showError = false;
            this.router.navigate(['home']);
          } 
        },
        error: (error: any) => {
          this.showError = true;
        }
      })
    }
  }

  isResponseValid(res: any){
    return res && Object.keys(res).length > 0 && this.areTokensFromResponseValid(res)
  }

  areTokensFromResponseValid(res: any){
    return (res.access_token && res.refresh_token) ? true : false;
  }

  navigateToRegister(){
    this.router.navigate(['register']);
  }
}
