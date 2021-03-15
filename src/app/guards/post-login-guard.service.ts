import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NetworkService } from '../services/network/network.service';
import { RouterService } from '../services/router/router.service';

/**
 * The guard used to activate the application pages for the authenticated user
 */
@Injectable()
export class PostLoginGuardService implements CanActivate {

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
            .pipe(
                tap((response: boolean) => {
                    if (!response) {
                        this.routerService.navigateToFirstPageBeforeLogin();
                    }
                })
            );
    }

}
