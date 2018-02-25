import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';

declare const AOS: any;
declare const $: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: [ './home.component.css' ]
})
export class HomeComponent implements OnInit {
    enhanced = false;
    isLoggedIn = false;
    isCurrent = true;
    activated = false;
    menuOpacity = 0;
    menuHeight = '0';
    menuZ = 0;

    constructor(private _auth: AuthService, private _router: Router, private afs: AngularFirestore) {
    }

    ngOnInit() {
        this._auth.authState.subscribe((state) => {
            this.isLoggedIn = !(state === null);
        });
        const init = [];
        const x = setInterval(() => {
            init.push(AOS.init({
                disable: 'mobile'
            }));
            if (init.length >= 2) {
                clearInterval(x);
            }
        }, 1500);
        setTimeout(() => {
            this.enhanced = true;
        }, 1000);
        $(window).scroll(function () {
            const scroll = $(window).scrollTop();
            if (scroll >= 300 && scroll <= 3900) {
                $('.dotstyle').addClass('darkDot');
            } else {
                $('.dotstyle').removeClass('darkDot');
            }
        });
    }

    toggleMobileMenu() {
        this.activated = !this.activated;
        this.menuOpacity = this.activated ? 1 : 0;
        this.menuZ = this.activated ? 800 : 0;
        this.menuHeight = this.activated ? '100%' : '0';
        if (this.activated) {
            $('body').css('overflow', 'hidden');
            $('html').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', 'visible');
            $('html').css('overflow', 'visible');
        }
    }

    logout(): void {
        this._auth.logout().then(() => {
            this._router.navigateByUrl('/sign-in');
        });
    }
}
