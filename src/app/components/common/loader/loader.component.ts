import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { NetworkService } from '../../../services/network/network.service';
import { LoggerService } from '../../../services/logger/logger.service';
import { EventBusService } from '../../../services/event-bus/event-bus.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * Boolean used to get the loader visible/invisible
   */
  private isLoaderVisible = false;

  constructor(
    private cdRef: ChangeDetectorRef,
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
    this.subscriptions.push(this.eventBusService.loaderVisibilityEvent
      .subscribe(
        (data: boolean) => {
          if (this.isLoaderVisible !== data) {
            this.isLoaderVisible = data;
            if (this.isLoaderVisible) {
              window.scroll(0, 0);
            }
            this.cdRef.detectChanges();
            this.loggerService.debug('Loader\'s visibility status has changed.', data);
          }
        },
        error => {
          this.loggerService.error('Unable to get the loader\'s visibility status change!', error);
          return Observable.throw(error);
        }
      )
    );
  }

  ngOnDestroy() { }

}
