import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  showError = false;

  registerForm = new FormGroup({
    userName: new FormControl('', [Validators.required, Validators.minLength(6)]),
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.minLength(6), Validators.required])
  });

  constructor(private userService: UserService, private router: Router, private authService: AuthService) {
    
  }

  register(){
    if(this.registerForm.valid){
      this.showError = false;
      
      this.userService.register({
        username: this.registerForm.value.userName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      }).subscribe({
        next: (res: any) => {
          if(this.isResponseValid(res)){
            this.authService.storeTokensToLocalStorage(res);
            this.authService.setUser();
            this.router.navigate(['home']);
          } else{
            this.showError = true;
          }
        },
        error: (error: any) => {
          this.showError = true;
        }
      });
    }
  }

  isResponseValid(res: any){
    return res && Object.keys(res).length > 0 && this.areTokensFromResponseValid(res)
  }

  areTokensFromResponseValid(res: any){
    return (res.access_token && res.refresh_token) ? true : false;
  }

  hideError(){
    this.showError = false;
  }

  navigateBackToLogin(){
    this.router.navigate(['login']);
  }
}
