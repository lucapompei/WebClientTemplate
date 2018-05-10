import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../base/base.component';
import { LoggerService } from '../../services/logger/logger.service';
import { FieldInterface } from '../common/form/field.interface';
import { LoginFields } from './login-fields';
import { FormComponent } from '../common/form/form.component';
import { NetworkService } from '../../services/network/network.service';
import { EventBusService } from '../../services/event-bus/event-bus.service';
import { UserCredentials } from '../../interfaces/user-credentials.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * The login fields
   */
  private loginFields: FieldInterface[] = [];

  /**
   * The login form
   */
  @ViewChild('loginForm') loginForm: FormComponent;

  constructor(
    private networkService: NetworkService,
    private eventBusService: EventBusService,
    private loggerService: LoggerService
  ) {
    super();
    // Initializes the login fields
    this.loginFields = new LoginFields().loginFields;
  }

  ngOnInit() { }

  ngOnDestroy() { }

  /**
   * Logs the user
   */
  public login() {
    // Checks each field validation status
    if (this.loginForm.areValidatedFields()) {
      // Getting email and password values
      const emailValue = this.loginForm.getValueByKey('email');
      const passwordValue = this.loginForm.getValueByKey('password');
      const userCredentials: UserCredentials = {
        username: emailValue,
        password: passwordValue
      };
      // Changes the application loading status
      this.eventBusService.changeLoadingVisibility(true);
      // Subscription for getting known the login phase completion
      this.subscriptions.push(
        this.networkService.login(userCredentials).subscribe(
          data => {
            this.loggerService.info('Login successfully done.', data);
          },
          error => {
            this.loggerService.error('Error during login!', error);
            return Observable.throw(error);
          },
          () => {
            this.eventBusService.changeLoadingVisibility(false);
          }
        )
      );
    }
  }

}
