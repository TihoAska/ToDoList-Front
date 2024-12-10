import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ToDoList';

  constructor(private router: Router, private authService: AuthService) {

  }

  ngOnInit(){
    if(this.authService.isUserLoggedIn()){
      this.authService.setUser();
      this.router.navigate(['home']);
    } else{
      this.router.navigate(['login']);
    }
  }
}
