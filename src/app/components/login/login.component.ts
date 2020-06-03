import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { LoggerService } from '../../services/logger/logger.service';
import { FieldInterface } from '../common/form/field.interface';
import { LoginFields } from './login.fields';
import { FormComponent } from '../common/form/form.component';
import { NetworkService } from '../../services/network/network.service';
import { EventBusService } from '../../services/event-bus/event-bus.service';
import { UserCredentials } from '../../interfaces/user-credentials.interface';

/**
 * The login component used to authenticate the user
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * The login fields
   */
  loginFields: FieldInterface[] = [];

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
      // Getting username and password values
      const usernameValue = this.loginForm.getValueByKey('username');
      const passwordValue = this.loginForm.getValueByKey('password');
      const userCredentials: UserCredentials = {
        username: usernameValue,
        password: passwordValue
      };
      // Changes the application loading status
      this.eventBusService.changeLoadingVisibility(true);
      // Subscription for getting known the login phase completion
      this.subscriptions.push(
        this.networkService.login(userCredentials).subscribe(
          (data: any) => {
            this.eventBusService.changeLoadingVisibility(false);
            this.loggerService.info('Login successfully done.', data);
          },
          (error: any) => {
            this.eventBusService.changeLoadingVisibility(false);
            this.loggerService.error('Error during login!', error);
          }
        )
      );
    }
  }

}
