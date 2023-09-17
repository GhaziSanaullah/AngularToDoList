import { Component } from '@angular/core';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import {CdkDragDrop,moveItemInArray,transferArrayItem}from '@angular/cdk/drag-drop';
import { ITask } from '../model/task';
import { trigger, transition, animate, style } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { TaskPopupComponent } from '../task-popup/task-popup.component';
import { DialogService } from '../dialog.service';

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
  constructor(private fb:FormBuilder,private dialogService: DialogService,private dialog: MatDialog){}
  openDialog() {
    this.dialogService.openSampleDialog();
  }
  ngOnInit():void{
    this.todoForm = this.fb.group({
      item:['',Validators.required]
    })
  }
  addTask(){
    this.tasks.push({
      description:this.todoForm.value.item,
      done:false
    })
    this.todoForm.reset();
  }
  deleteTask(i:number){
    this.tasks.splice(i,1)
  }
  deleteDoneTask(i:number){
    this.done.splice(i,1)
  }
  onEditTask(item: ITask, index: number) {
    const dialogRef = this.dialog.open(TaskPopupComponent, {
      width: '1000px',
      height: '500px',
      data: { item: item, index: index }, // Pass the item and index to the dialog
    });
    dialogRef.componentInstance.taskUpdated.subscribe((updatedTask: ITask) => {
      this.tasks[index].description=updatedTask.description;
    this.tasks[index].done=false;
    });
  }
  moveToDone(index: number) {
    const taskToMove = this.tasks[index];
    this.tasks.splice(index, 1);
    this.done.push(taskToMove);
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
