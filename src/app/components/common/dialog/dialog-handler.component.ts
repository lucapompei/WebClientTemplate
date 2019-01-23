import { Component, OnInit, Inject } from '@angular/core';
import { LoggerService } from '../../../services/logger/logger.service';
import { EventBusService } from '../../../services/event-bus/event-bus.service';
import { BaseComponent } from '../../base/base.component';
import { DialogRequestInterface } from './dialog-request.interface';
import { MatDialog } from '@angular/material';
import { DialogComponent } from './dialog.component';

/**
 * The dialog handler component
 */
@Component({
  selector: 'app-dialog-handler',
  templateUrl: './dialog-handler.component.html'
})
export class DialogHanlderComponent extends BaseComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private eventBusService: EventBusService,
    private loggerService: LoggerService,
  ) {
    super();
  }

  ngOnInit() {
    // Listening for dialog request event
    this.subscriptions.push(
      this.eventBusService.dialogRequestEvent.subscribe(
        (data: DialogRequestInterface) => {
          this.loggerService.debug('Received a new dialog request');
          this.handleDialogRequest(data);
        }
      )
    );
  }

  /**
   * Handles a new dialog request
   *
   * @param data
   */
  private handleDialogRequest(data: DialogRequestInterface): void {
    this.dialog.open(DialogComponent, {
      data: data
    });
  }

}
