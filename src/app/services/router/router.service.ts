import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable()
export class RouterService {

  /**
   * The first page to show before the login
   */
  private firstPageBeforeLogin: string;

  /**
   * The first page to show after the login
   */
  private firstPageAfterLogin: string;

  constructor(
    private router: Router
  ) {
    // Initializes the main pages used for routing purpose
    this.firstPageBeforeLogin = environment.firstPageBeforeLogin;
    this.firstPageAfterLogin = environment.firstPageAfterLogin;
  }

  /**
   * Navigates to the first page to show before the login
   */
  public navigateToFirstPageBeforeLogin(): void {
    this.router.navigate([this.firstPageBeforeLogin]);
  }

  /**
   * Navigates to the first page to show before the login
   */
  public navigateToFirstPageAfterLogin(): void {
    this.router.navigate([this.firstPageAfterLogin]);
  }

}
