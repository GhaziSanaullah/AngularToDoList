import { Component } from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {CdkDragDrop,moveItemInArray,transferArrayItem}from '@angular/cdk/drag-drop';
import { ITask } from '../model/task';
import { trigger, transition, animate, style } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { TaskPopupComponent } from '../task-popup/task-popup.component';
import { DialogService } from '../dialog.service';
import { TaskService } from '../task.service';



@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  animations: [
    trigger('taskToDone', [
        transition(':enter', [
          style({ opacity: 0 }), 
          animate('1000ms', style({ opacity: 1 }))
        ])
    ])
  ]
})
export class TodoComponent 
{
  todoForm !:FormGroup;
  tasks:ITask[]=[];
  done:ITask[]=[];
  triggerAnimation:boolean = false;

  constructor(private fb:FormBuilder,private dialogService: DialogService,private dialog: MatDialog,private taskService: TaskService){}
  openDialog() {
    this.dialogService.openSampleDialog();
  }

  ngOnInit():void{
  
    this.todoForm = this.fb.group({
      item:['',Validators.required]
    })
    // Fetch tasks when the component initializes
    this.fetchTasks();
  }
  fetchTasks() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks.filter(task => !task.IsCompleted);
      this.done = tasks.filter(task => task.IsCompleted);

      console.log(this.tasks);
      console.log(this.done);
    });
  }
  addTask(){
    const newTask: ITask = {
      Description: this.todoForm.value.item,
      IsCompleted: false
    };

    this.taskService.insertTask(newTask).subscribe(response => {
      if (response === 'Task inserted successfully') {
        this.fetchTasks(); // Fetch updated tasks after adding a new one
        this.todoForm.reset();
      } else {
        console.log('Failed to insert task');
      }
    });
    this.fetchTasks();
    this.todoForm.reset();
  }
  deleteTask(i: number) {
    const taskToDelete = this.tasks[i];
    if (taskToDelete.TaskID !== undefined) { // Check if TaskID is defined
      this.taskService.deleteTask(taskToDelete.TaskID).subscribe(response => {
        if (response === 'Task deleted successfully') {
          this.tasks.splice(i, 1); // Remove the task from the tasks array
        } else {
          console.log('Failed to delete task');
        }
      });
    } else {
      console.log('Task ID is undefined');
    }
  }
  deleteDoneTask(i:number){
    const taskToDelete = this.done[i];
    if (taskToDelete.TaskID !== undefined) { // Check if TaskID is defined
      this.taskService.deleteTask(taskToDelete.TaskID).subscribe(response => {
        if (response === 'Task deleted successfully') {
          this.fetchTasks();
        } else {
          console.log('Failed to delete task');
        }
      });
    } else {
      console.log('Task ID is undefined');
    }
  }
  onEditTask(item: ITask, index: number) {
    const dialogRef = this.dialog.open(TaskPopupComponent, {
      width: '1000px',
      height: '500px',
      data: { item: item, index: index },
    });

    dialogRef.componentInstance.taskUpdated.subscribe((updatedTask: ITask) => {
      this.tasks[index].Description = updatedTask.Description;
      this.tasks[index].done = false;

      if (updatedTask.TaskID !== undefined) { // Check if TaskID is defined
        this.taskService.updateTaskDescription(updatedTask.TaskID, updatedTask.Description).subscribe(
          response => {
            console.log(response);
          },
          error => {
            console.error(error);
          }
        );
      } else {
        console.log('Task ID is undefined');
      }
    });
  }
  moveToDone(index: number) {
    const taskToMove = this.tasks[index];
    
    if (taskToMove.TaskID !== undefined) {
      // Update the task's IsCompleted status to true using the TaskService
      this.taskService.updateTaskIsCompletedStatus(taskToMove.TaskID, true).subscribe(response => {
        if (response === 'Task completion status updated successfully') {
          this.fetchTasks();
        } else {
          console.log('Failed to update task completion status');
        }
      });
    } else {
      console.log('Task ID is undefined');
    }
  }
  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
