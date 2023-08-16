import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-popup',
  templateUrl: './task-popup.component.html',
})
export class TaskPopupComponent {
  constructor(private dialogRef: MatDialogRef<TaskPopupComponent>) {}
  closeDialog() {
    this.dialogRef.close();
  }
}
