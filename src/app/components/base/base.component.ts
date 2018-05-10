import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ISubscription } from 'rxjs/Subscription';

export class BaseComponent implements OnInit, OnDestroy {

  /**
   * Subscriptions container
   */
  subscriptions: ISubscription[] = [];

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() {
    // Unsubscribes all subscriptions
    if (this.subscriptions != null) {
      const listSize = this.subscriptions.length;
      for (let index = 0; index < listSize; index++) {
        this.subscriptions[index].unsubscribe();
      }
    }
  }

}
