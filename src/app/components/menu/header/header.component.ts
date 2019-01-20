import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { NetworkService } from '../../../services/network/network.service';
import { EventBusService } from '../../../services/event-bus/event-bus.service';
import { LoggerService } from '../../../services/logger/logger.service';

/**
 * The header component
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(
    private eventBusService: EventBusService,
    private loggerService: LoggerService,
    private networkService: NetworkService
  ) {
    super();
  }

  ngOnInit() { }

  ngOnDestroy() { }

  logout(): void {
    this.eventBusService.changeLoadingVisibility(true);
    // Subscriptions for log out the logged user
    this.subscriptions.push(
      this.networkService.logout().subscribe(
        (data: any) => {
          this.eventBusService.changeLoadingVisibility(false);
          this.loggerService.info('Logout successfully done.', data);
        },
        (error: any) => {
          this.eventBusService.changeLoadingVisibility(false);
          this.loggerService.error('Error during logout!', error);
        }
      )
    );
  }

}
