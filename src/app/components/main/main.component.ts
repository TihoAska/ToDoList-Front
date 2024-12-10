import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main',
  standalone: false,
  
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  currentRoute = ''
  username = ''

  constructor(
    private router: Router, 
    private taskService: TaskService, 
    public userService: UserService, 
    private authService: AuthService) {
    
  }

  ngOnInit(){
    this.userService.$loggedUser.subscribe(res => {
      if(this.isResponseValid(res)){
        if(res.id != -1){
          this.username = res.username;
          this.taskService.getUndoneTasksByUserId(res.id).subscribe((res: any) => {
            if(this.isResponseValid(res)){
              let tasksWithIsChecked = this.addIsCheckedPropertyToTasks(res.tasks);
              this.taskService.$tasks.next(tasksWithIsChecked);
            }
          });
        }
      }
    });
  }

  addIsCheckedPropertyToTasks(tasks: any){
    const tasksWithIsChecked = tasks.map((task: any) => ({
      ...task,
      isChecked: false,
    }));

    return tasksWithIsChecked;
  }

  getUsername(){
    return this.username ? (this.username + "'s ") : '';
  }

  removeUsername(){
    this.username = ''
  }

  logout(){
    this.removeUsername();
    this.authService.removeTokensFromLocalStorage();
    this.authService.removeUser();
    this.router.navigate(['login']);
  }
  
  isResponseValid(res: any){
    return res && Object.keys(res).length > 0;
  }

  isUserLoggedIn(){
    return this.authService.isUserLoggedIn();
  }
}
