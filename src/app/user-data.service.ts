import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserDataInterface } from './interfaces/user-data.interface';
import { User } from './interfaces/user';
import { Utils } from './utilities/utils';

@Injectable()
export class UserDataService {
  userData: BehaviorSubject<User> = new BehaviorSubject(null);
  userReference: AngularFirestoreDocument<User>;
  constructor(private _auth: AuthService, public afs: AngularFirestore) {
    this._auth.authState.subscribe((res) => {
      if (res === null) {
        this.userData.next(new User('', '', '', { profileImage: '' }));
        console.log('creating default user');
      } else {
        console.log('User is logged in: ' + res.email);
        this.userReference = this.afs.doc<User>(`/users/${ res.uid }`);
        if (res.emailVerified) {
          this.userReference.valueChanges().subscribe((response) => {
            if (response == null) {
              const data = new User('', '', res.email, { profileImage: res.photoURL });
              this.userReference.set(data);
              console.log('added to firebase collection');
            } else {
              this.userData.next(response);
              console.log('received user data: ', this.userData.getValue());
            }
          });
        }
      }
    });
  }


  public updateProfile(data: Object) {
    if (data instanceof User) {
      return this.userReference.update(Utils.toJson(data));
    }
    return this.userReference.update(data);
  }

  public get user() {
    return this.userData;
  }
}