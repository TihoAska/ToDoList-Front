import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  displayError = false;
  errorMessage = ''

  forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required])
  })

  constructor(private userService: UserService, private router: Router) {

    
  }

  forgotPassword(){
    if(this.forgotPasswordForm.valid){
      if(this.forgotPasswordForm.value.email){
        this.displayError = false;
        
        this.userService.forgotPassword({
          email: this.forgotPasswordForm.value.email
        }).subscribe({
          next: (res: any) => {
            console.log(res);
          },
          error: (error: any) => {
            console.log(error)
            this.displayUserNotFoundError();
          }
        });
      }
    } else{
      this.displayInvalidEmailFormatError();
    }
  }

  displayInvalidEmailFormatError(){
    this.displayError = true
    this.errorMessage = 'Invalid email format'
  }

  displayUserNotFoundError(){
    this.displayError = true;
    this.errorMessage = 'No users were found for the given email'
  }

  navigateBackToLogin(){
    this.router.navigate(['login']);
  }
}
