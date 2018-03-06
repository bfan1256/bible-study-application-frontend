import { Group } from './interfaces/group';
import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserDataInterface } from './interfaces/user-data.interface';
import { User } from './interfaces/user';
import { Utils } from './utilities/utils';
import { UserDataService } from './user-data.service';
import { GroupDataInterface } from './interfaces/group-data.interface';


@Injectable()
export class GroupDataService {
  groups: BehaviorSubject<GroupDataInterface[]> = new BehaviorSubject([]);
  group_sync = [];
  constructor(private user: UserDataService, public afs: AngularFirestore) {
    this.user.userID.subscribe((uid) => {
      if (uid === '') {
        this.groups.next([]);
      } else {
        const groupReference = this.afs.collection(`/users/${ uid }/groups`);
        groupReference.valueChanges().subscribe((groups) => {
          this.group_sync = [];
          if (groups.length === 0) {
            console.log('this person does not have any groups');
          }
          groups.forEach((groupData) => {
            console.log(groupData);
            // get group data
            this.afs.doc(`/groups/${ groupData[ 'id' ] }`).valueChanges().subscribe((data) => {
              console.log(data);
              this.group_sync.push(data[ 'metadata' ]);
              this.groups.next(this.group_sync);
            });
          });
        });
      }
    });
  }

  createGroup(name: string, data: GroupDataInterface) {
    const uniqueID = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    const firebaseData = { 'name': name, 'uniqueID': uniqueID, 'metadata': data };
    const firebaseID = this.afs.createId();
    return this.afs.doc(`/groups/${ firebaseID }`).set(firebaseData).then(() => {
      return firebaseID;
    });
  }

}
