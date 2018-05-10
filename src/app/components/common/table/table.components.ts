import { Component, OnInit, OnDestroy, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TableConfigurationInterface } from './table-configuration.interface';
import { BaseComponent } from '../../base/base.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TableComponent extends BaseComponent implements OnInit, OnDestroy {

    /**
     * Table properties
     */
    private dataSource: MatTableDataSource<any>;
    private pageSizeOptions: number[] = [5, 10, 25, 50, 100];

    /**
     * View child
     */
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor() {
        super();
    }

    ngOnInit() { }

    ngOnDestroy() { }

    /**
     * Configures the table
     *
     * @param tableConfiguration
     */
    public configureTable(tableConfiguration: TableConfigurationInterface): void {
        // Assigns input data and initializes table
        this.dataSource = new MatTableDataSource(tableConfiguration.data);
        if (tableConfiguration.pageSizeOptions) {
            this.pageSizeOptions = tableConfiguration.pageSizeOptions;
        }
        // Initializes paginator functionality
        this.dataSource.paginator = this.paginator;
    }

    /**
     * Gets the data source
     */
    public getDataSource(): MatTableDataSource<any> {
        return this.dataSource;
    }

    /**
     * Using the given value,
     * it applies the filter to the table data
     *
     * @param filterValue
     */
    private applyFilter(filterValue: string): void {
        // Filters the data source
        this.dataSource.filter = filterValue.trim().toLocaleLowerCase();
    }

}
