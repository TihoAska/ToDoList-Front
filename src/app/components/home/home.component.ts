import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { fromReadableStreamLike } from 'rxjs/internal/observable/innerFrom';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  tasks: any = []

  constructor(private router: Router, public taskService: TaskService, private userService: UserService) {
    
  }

  ngOnInit(){ 
    this.taskService.$tasks.subscribe(res => {
      this.tasks = res;
    })
  }

  isAnythingChecked(){
    let tasks = this.tasks.filter((task: any) => task.isChecked == true)

    return tasks.length > 0 ? true : false;
  }

  check(task: any){
    task.isChecked = !task.isChecked;
  }

  isChecked(task: any){
    return task.isChecked;
  }

  unCheckAll(){
    this.tasks.forEach((task: any) => {
      task.isChecked = false;
    })
  }

  markAsDone(){
    let tasks = this.filterTasksByDoneAndLeft()

    this.taskService.markAsDone({
      taskIds: tasks.doneTasksIds,
      userId: this.userService.$loggedUser.value.id,
    }).subscribe(res => {
      if(this.isResponseValid(res)){
        this.taskService.$tasks.next(tasks.leftTasks);
      }
    });
  }

  filterTasksByDoneAndLeft(){
    let doneTasksIds: any = []
    let leftTasks: any = []

    this.tasks.forEach((task: any) => {
      task.isChecked ? doneTasksIds.push(task.id) : leftTasks.push(task);
    })

    return {
      'doneTasksIds': doneTasksIds,
      'leftTasks': leftTasks,
    }
  }

  navigateToCreate(){
    this.unCheckAll();
    this.router.navigate(['create']);
  }

  isResponseValid(res: any){
    return res && Object.keys(res).length > 0;
  }
}
