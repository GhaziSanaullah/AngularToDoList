import { Component, Inject } from '@angular/core';
import { Component, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {FormGroup,FormBuilder,Validators} from '@angular/forms';
import { ITask } from '../model/task';

@Component({
  selector: 'app-task-popup',
  templateUrl: './task-popup.component.html',
})
export class TaskPopupComponent {
  constructor(private dialogRef: MatDialogRef<TaskPopupComponent>) {}
  updateForm !:FormGroup;
  @Output() taskUpdated = new EventEmitter<ITask>();

  constructor(
    private dialogRef: MatDialogRef<TaskPopupComponent>,
    private formBuilder: FormBuilder, // Add formBuilder injection
    @Inject(MAT_DIALOG_DATA) public data: { item: ITask, index: number } // Inject data from the parent component
  ){
    this.updateForm = this.formBuilder.group({
      item: ['', Validators.required], // Initialize the form control
    });
    // Populate the form with data passed from parent component
    this.updateForm.controls['item'].setValue(data.item.description);
  }
  updateTask() {
    const updatedTask: ITask = {
      ...this.data.item,
      description: this.updateForm.value.item,
    };

    this.taskUpdated.emit(updatedTask); // Emit the updated task
    this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
