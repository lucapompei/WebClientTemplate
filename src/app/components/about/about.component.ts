import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { environment } from '../../../environments/environment';

/**
 * Component used to display information about the application
 */
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent extends BaseComponent implements OnInit, OnDestroy {

  /**
   * Application version
   */
  appVersion: string;

  constructor() {
    super();
  }

  ngOnInit() {
    // Take application version from environment
    this.appVersion = environment.appVersion;
  }

  ngOnDestroy() { }

}