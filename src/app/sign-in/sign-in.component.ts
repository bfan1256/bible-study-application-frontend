import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {User} from '../interfaces/user';

declare const AOS: any;

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
    incorrectPassword = false;
    emailSignInForm: FormGroup;
    email_regex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"' +
        '(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")' +
        '@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?' +
        '|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])' +
        '|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]' +
        '|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');

    constructor(public title: Title, private _auth: AuthService, private fb: FormBuilder) {
        this.title.setTitle('Biblya | Sign In');
    }

    ngOnInit() {
        AOS.init({
            disable: 'mobile'
        });
        this.createForm();
        // this._auth.logout();
        this._auth.authState.subscribe((state) => {
            if (state === null) {
                console.log('not logged in');
            } else {
                console.log('logged in');
                console.log('user is logged in');
            }
        });
    }

    createForm(): void {
        this.emailSignInForm = this.fb.group({
            email: ['', [Validators.required, Validators.pattern(this.email_regex)]],
            password: ['', Validators.required]
        });
    }

    get email() {
        return this.emailSignInForm.get('email');
    }

    get password() {
        return this.emailSignInForm.get('password');
    }

    signIn(provider, data = null) {
        this._auth.userLogin(provider, data).then((res: User | Object) => {
            if (res instanceof User) {
                console.log(res);
                console.log(res.email);
            } else {
                if (res['errorCode'] === 'auth/wrong-password') {
                    this.incorrectPassword = true;
                }
            }
        });
    }

    signInWithEmail() {
        this.signIn('email', {email: this.email.value, password: this.password.value});
    }

}
