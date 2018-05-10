import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../base/base.component';
import { LoggerService } from '../../services/logger/logger.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { NetworkService } from '../../services/network/network.service';
import { EventBusService } from '../../services/event-bus/event-bus.service';
import { TableConfigurationInterface } from '../common/table/table-configuration.interface';
import { TableComponent } from '../common/table/table.components';
import { ElementInterface } from '../../interfaces/element.interface';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.css']
})
export class ElementsComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * The elements
   */
  private elements: ElementInterface[];

  /**
   * The table columns
   */
  private columns: string[] = ['icon_element', 'name', 'description'];

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
      this.networkService.getElements().subscribe(
        (elements: ElementInterface[]) => {
          this.elements = elements;
          this.loggerService.info('Received the list of registered elements.', elements);
          // Inizializes the table
          this.initializeTable();
        },
        error => {
          this.loggerService.error('Unable to get the list of registered elements!', error);
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
      data: this.elements
    };
    // Sets the configuration
    this.table.configureTable(tableConfiguration);
  }

}
