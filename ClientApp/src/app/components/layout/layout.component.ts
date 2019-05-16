import { Component } from '@angular/core';
import { LayoutModule, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
} from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.css']
})

export class LayoutComponent {
    url: string;
    isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches)
        );

    constructor(private breakpointObserver: BreakpointObserver,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        this.url = window.location.pathname;
    }
    logout() {
        this.authenticationService.logout();

    }

}
