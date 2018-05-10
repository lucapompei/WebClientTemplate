import { Component, OnInit, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BaseComponent } from '../base/base.component';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor(
    private loggerService: LoggerService
  ) {
    super();
  }

  ngOnInit() { }

  ngOnDestroy() { }

}
