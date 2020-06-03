import { Component, OnInit, Inject } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { DialogRequestInterface } from './dialog-request.interface';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * The centralized dialog component
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent extends BaseComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogRequest: DialogRequestInterface
  ) {
    super();
  }

  ngOnInit() { }

  retry() {
    this.dialogRef.close();
    this.dialogRequest.callback();
  }

}
