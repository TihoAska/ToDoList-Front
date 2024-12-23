import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  standalone: false,
  
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  createTaskForm = new FormGroup({
    taskName: new FormControl('', Validators.required),
  })

  constructor(private taskService: TaskService, private router: Router, private userService: UserService) {

  }

  createTask(){
    if(this.isTaskNameValid(this.createTaskForm.value.taskName)){
      this.taskService.create({
        title: this.createTaskForm.value.taskName,
        userId: this.userService.$loggedUser.value.id,
      }).subscribe((res: any) => {
        this.taskService.$tasks.next([...this.taskService.$tasks.value, res.task]);
        this.router.navigate(['home']);
      });
    }
  }

  isTaskNameValid(taskName: any){
    return taskName && taskName.trim().length > 0 && taskName.trim().length < 20
  }

  navigateBack(){
    this.router.navigate(['home']);
  }

  isTaskNameOver20Characters(){
    let taskName = this.createTaskForm.value.taskName?.trim();

    if(taskName){
      return taskName.length > 20;
    }

    return false;
  }

  isInputEmpty(){
    let taskName = this.createTaskForm.value.taskName?.trim();
    return !taskName || taskName.length == 0
  }
}
