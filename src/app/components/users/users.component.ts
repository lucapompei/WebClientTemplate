import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../base/base.component';
import { LoggerService } from '../../services/logger/logger.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { NetworkService } from '../../services/network/network.service';
import { EventBusService } from '../../services/event-bus/event-bus.service';
import { UsersInterface } from '../../interfaces/users.interface';
import { TableConfigurationInterface } from '../common/table/table-configuration.interface';
import { TableComponent } from '../common/table/table.components';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * The users
   */
  private users: UsersInterface[];

  /**
   * The table columns
   */
  private columns: string[] = ['username', 'email'];

  /**
   * View child
   */
  @ViewChild('table') table: TableComponent;

  constructor(
    private loggerService: LoggerService,
    private networkService: NetworkService,
    private eventBusService: EventBusService
  ) {
    super();
  }

  ngOnInit() {
    // Retrieves the data and initializes the table
    this.getDataAndInitializeTable();
  }

  ngOnDestroy() { }

  /**
   * Retrieves the data and configures the table
   */
  private getDataAndInitializeTable(): void {
    this.eventBusService.changeLoadingVisibility(true);
    // Subscribtion for getting the projects data
    this.subscriptions.push(
      this.networkService.getUsers().subscribe(
        (users: UsersInterface[]) => {
          this.users = users;
          this.loggerService.info('Received the list of registered users.', users);
          this.initializeTable();
        },
        error => {
          this.loggerService.error('Unable to get the list of registered users!', error);
          return Observable.throw(error);
        },
        () => {
          this.eventBusService.changeLoadingVisibility(false);
        }
      )
    );
  }

  /**
   * Configures the table
   */
  private initializeTable(): void {
    // Builds the configuration
    const tableConfiguration: TableConfigurationInterface = {
      data: this.users
    };
    // Sets the configuration
    this.table.configureTable(tableConfiguration);
  }

}
