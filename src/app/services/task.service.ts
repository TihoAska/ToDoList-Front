import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  backendUrl = environment.backendUrl;

  $tasks: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    private http: HttpClient
  ) {
  }

  getAll(){
    return this.http.get(this.backendUrl + 'api/task/get-all/');
  }

  getUndoneTasksByUserId(userId: number){
    return this.http.get(this.backendUrl + 'api/task/get-undone-tasks/' + userId + '/');
  }

  create(task: any){
    return this.http.post(this.backendUrl + 'api/task/create/', task);
  }

  delete(task: any){
    return this.http.delete(this.backendUrl + 'api/task/delete/', task);
  }

  markAsDone(tasksIds: any){
    return this.http.put(this.backendUrl + 'api/task/mark-as-done/', tasksIds);
  }
}
