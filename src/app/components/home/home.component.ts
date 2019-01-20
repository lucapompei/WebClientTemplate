import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base/base.component';

/**
 * The main application component
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor() {
    super();
  }

  ngOnInit() { }

  ngOnDestroy() { }

}
