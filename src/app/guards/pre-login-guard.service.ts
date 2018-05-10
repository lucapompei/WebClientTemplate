import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NetworkService } from '../services/network/network.service';
import { RouterService } from '../services/router/router.service';

@Injectable()
export class PreLoginGuardService implements CanActivate {

    constructor(
        private routerService: RouterService,
        private networkService: NetworkService
    ) { }

    /**
     * Return a boolean, based on the authentication status,
     * to indicate if a component can be activated or not
     */
    canActivate(): Observable<boolean> {
        return this.networkService.isAuthenticated()
            .do(response => {
                if (!response) {
                    this.routerService.navigateToFirstPageBeforeLogin();
                }
            });
    }

}
