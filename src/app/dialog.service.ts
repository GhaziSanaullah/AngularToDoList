import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskPopupComponent } from './task-popup/task-popup.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openSampleDialog() {
    this.dialog.open(TaskPopupComponent, {
      width: '300px', // Adjust the width as needed
    });
  }
}