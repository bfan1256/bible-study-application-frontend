import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareModule } from '@ngx-share/core';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';


// components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SearchComponent } from './search/search.component';
import { ResultsComponent } from './results/results.component';
import { ResultCardComponent } from './result-card/result-card.component';

// providers
import { SearchService } from './search.service';
import { SignInComponent } from './sign-in/sign-in.component';
import { GetStartedComponent } from './get-started/get-started.component';
import { AuthService } from './auth.service';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { UserDataService } from './user-data.service';
import { DashboardComponent } from './dashboard/dashboard.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search', component: SearchComponent },
    { path: 'sign-in', component: SignInComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
    { path: 'get-started', component: GetStartedComponent },
    { path: 'password-reset', component: PasswordResetComponent }
    { path: 'dashboard/home', component: DashboardComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        FooterComponent,
        NavbarComponent,
        SearchComponent,
        ResultsComponent,
        ResultCardComponent,
        SignInComponent,
        GetStartedComponent,
        PasswordResetComponent,
        VerifyEmailComponent,
        DashboardComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase, 'biblya'),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        environment.production
            ? ServiceWorkerModule.register('/ngsw-worker.js')
            : [],
        RouterModule.forRoot(appRoutes),
        ScrollToModule.forRoot(),
        HttpClientModule,
        HttpClientJsonpModule,
        ClipboardModule,
        ShareModule.forRoot(),
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-left'
        })
    ],
    providers: [ SearchService, AuthService, UserDataService ],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
