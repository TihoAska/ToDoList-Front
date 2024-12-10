import { backendUrl } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  $tasks: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(backendUrl + 'api/task/get-all/');
  }

  getUndoneTasksByUserId(userId: number){
    return this.http.get(backendUrl + 'api/task/get-undone-tasks/' + userId + '/');
  }

  create(task: any){
    return this.http.post(backendUrl + 'api/task/create/', task);
  }

  delete(task: any){
    return this.http.delete(backendUrl + 'api/task/delete/', task);
  }

  markAsDone(tasksIds: any){
    return this.http.put(backendUrl + 'api/task/mark-as-done/', tasksIds);
  }
}
