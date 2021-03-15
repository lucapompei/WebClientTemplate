import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseComponent } from '../../base/base.component';

/**
 * The footer component
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends BaseComponent implements OnInit, OnDestroy {

  constructor() {
    super();
  }

  ngOnInit() { }

  ngOnDestroy() { }

}
