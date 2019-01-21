import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NetworkService } from './services/network/network.service';
import { LoggerService } from './services/logger/logger.service';
import { BaseComponent } from './components/base/base.component';
import { EventBusService } from './services/event-bus/event-bus.service';
import { RouterService } from './services/router/router.service';
import { DialogRequestInterface } from './components/common/dialog/dialog-request.interface';

/**
 * Main application component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * Boolean used to getting known the server status
   */
  isServerAlive = false;

  /**
   * Boolean used to getting known the authentication status
   */
  private isAuthenticated = false;

  constructor(
    private routerService: RouterService,
    private translateService: TranslateService,
    private titleService: Title,
    private networkService: NetworkService,
    private loggerService: LoggerService,
    private eventBusService: EventBusService
  ) {
    super();
  }

  ngOnInit() {
    // First of all, checks if the server is alive or not
    this.checkServerStatus();
    // Observes the authentication status changes
    this.observeAuthenticationStatusChanges();
    // Initializes and keeps update the application title
    this.initAndKeepUpdateApplicationTitle();
  }

  ngOnDestroy() { }

  /**
   * Checks the server status
   */
  private checkServerStatus(): void {
    this.eventBusService.changeLoadingVisibility(true);
    // Subscribe for getting known the server status
    this.subscriptions.push(this.networkService.isServerAlive()
      .subscribe(
        (data: boolean) => {
          this.isServerAlive = data;
          this.eventBusService.changeLoadingVisibility(false);
          this.loggerService.info('Server status received.', data);
          this.handleServerStatus();
        },
        (error: any) => {
          this.eventBusService.changeLoadingVisibility(false);
          this.loggerService.error('Unable to get the server status!', error);
          this.handleServerStatus();
        }
      )
    );
  }

  /**
   * Handles the server status
   */
  private handleServerStatus(): void {
    if (!this.isServerAlive) {
      const dialogRequest: DialogRequestInterface = {
        title: 'server_title',
        message: 'server_down_message',
        callback: () => this.checkServerStatus()
      };
      this.eventBusService.sendDialogRequest(dialogRequest);
    }
  }

  /**
   * Observes the authentication status changes
   */
  private observeAuthenticationStatusChanges(): void {
    // Subscription for getting known the current authentication status
    this.subscriptions.push(
      this.networkService.isAuthenticated().subscribe(
        (data: boolean) => {
          this.handleAuthenticationStatusChanges(data);
        }
      )
    );
    // Subscriptions for getting known the authentication status changes
    this.subscriptions.push(
      this.eventBusService.authenticationStatusEvent.subscribe(
        (data: boolean) => {
          this.handleAuthenticationStatusChanges(data);
        }
      )
    );
  }

  /**
   * Handles each received authentication status change
   *
   * @param status
   */
  private handleAuthenticationStatusChanges(status: boolean): void {
    if (status !== this.isAuthenticated) {
      this.isAuthenticated = status;
      // With respect to the current authentication status,
      // navigates to the first valid page
      if (this.isAuthenticated) {
        this.routerService.navigateToFirstPageAfterLogin();
      } else {
        this.routerService.navigateToFirstPageBeforeLogin();
      }
    }
  }

  /**
   * Requests and sets the application title, for the current language
   */
  private setApplicationTitle(): void {
    // Subscribe for getting the application name to set the application title
    this.subscriptions.push(
      this.translateService.get('app_name')
        .subscribe(
          (data: string) => this.titleService.setTitle(data)
        )
    );
  }

  /**
   * Sets the application title and
   * observes languange changes to update it
   * with respect of new language set
   */
  private initAndKeepUpdateApplicationTitle(): void {
    // Sets the default language
    this.translateService.setDefaultLang('en');
    this.setApplicationTitle();
    // Subscribe for getting know of language changes
    this.subscriptions.push(this.translateService.onLangChange
      .subscribe(
        (data: any) => this.setApplicationTitle()
      )
    );
  }

}
