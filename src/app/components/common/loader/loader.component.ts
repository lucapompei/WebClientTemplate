import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoggerService } from '../../../services/logger/logger.service';
import { EventBusService } from '../../../services/event-bus/event-bus.service';
import { BaseComponent } from '../../base/base.component';

/**
 * Loader component used to wait the application breaks
 */
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * Counter used to track the number of pending requests received
   */
  private counter = 0;

  /**
   * Boolean used to get the loader visible/invisible
   */
  isLoaderVisible = false;

  constructor(
    private eventBusService: EventBusService,
    private loggerService: LoggerService
  ) {
    super();
  }

  ngOnInit() {
    // Handles all visibility changes
    this.handleVisibilityChange();
  }

  /**
   * Handles all visibility changes
   */
  private handleVisibilityChange() {
    // Subscribe for events that signal the loader visibility change
    this.subscriptions.push(
      this.eventBusService.loaderVisibilityEvent.subscribe(
        (data: boolean) => {
          // Increase/decrease counter
          this.counter += data ? 1 : -1;
          // The loader is visibile when the counter is positive
          this.isLoaderVisible = this.counter > 0;
        },
        (error: any) => {
          this.loggerService.error('Unable to get the loader\'s visibility status change!', error);
        }
      )
    );
  }

  ngOnDestroy() { }

}
