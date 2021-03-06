import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreModule } from './../../../core/core.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyComponent } from './study.page';
import { StudyNavComponent } from '../../components/study-nav/study-nav.component';
import { StudyDataService } from '../../services/study-data.service';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { SharedModule } from '../../../shared/shared.module';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ClipboardModule } from 'ngx-clipboard';

describe('StudyComponent', () => {
  let component: StudyComponent;
  let fixture: ComponentFixture<StudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        AngularFireModule.initializeApp(environment.firebase, 'biblink'),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        ClipboardModule,
        ToastrModule.forRoot({
          positionClass: 'toast-bottom-left'
        }),
        SharedModule,
        CoreModule
      ],
      declarations: [ StudyComponent, StudyNavComponent, PostCardComponent ],
      providers: [ StudyDataService ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
