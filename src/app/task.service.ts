import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITask } from './model/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3013/';
  constructor(private http: HttpClient) { }

  getTasks(): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${this.apiUrl}/GetTasks`);
  }
  insertTask(task: ITask): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/InsertTask`, task);
  }
  deleteTask(taskID: number): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/DeleteTask/${taskID}`, {});
  }
  updateTaskIsCompletedStatus(taskID: number, isCompleted: boolean): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/UpdateTaskIsCompletedStatus/${taskID}/${isCompleted}`, {});
  }
  updateTaskDescription(taskID: number, newDescription: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/UpdateTaskDescription/${taskID}`, `"${newDescription}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}