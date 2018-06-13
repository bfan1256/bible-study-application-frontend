import { ToastrService } from 'ngx-toastr';
import { Utils } from './../utilities/utils';
import { Component, OnInit, ViewEncapsulation, Input, EventEmitter, Output, HostListener, ElementRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { StudyDataService } from '../study-data.service';
import { UserDataService } from '../user-data.service';
import { Reply } from '../interfaces/reply';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: [ './post-card.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class PostCardComponent implements OnInit {
  @Input() contributors = [];
  @Input() isAnnotation = false;
  @Input() chapterRef = '';
  @Input() isLeader = false;
  @Input() userID = '';
  @Input() id = '';
  @Input() isLast = false;
  @Input() isCreator = false;
  @Input() studyID = '';
  @Output() delete = new EventEmitter<boolean>(false);
  @Output() edit = new EventEmitter<boolean>(false);
  @Output() reply = new EventEmitter<string>();
  @Output() more = new EventEmitter<boolean>(false);
  replies = [];
  activateDeleteModal = false;
  activateReplyModal = false;
  activateSubReplyModal = false;
  replyText = '';
  subReplyText = '';
  replyID = '';
  activateZ = 0;
  contributorImages = [];
  constructor(
    private afs: AngularFirestore,
    private _user: UserDataService,
    private _study: StudyDataService,
    private toastr: ToastrService,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    this.contributors.forEach(contributor => {
      let firstTime = false;
      let previousImage = '';
      this.afs.doc(`/users/${ contributor }`).valueChanges().subscribe((value) => {
        if (firstTime) {
          const index = this.contributorImages.indexOf(previousImage);
          this.contributorImages[ index ] = value[ 'data' ][ 'profileImage' ];
        }
        this.contributorImages.push(value[ 'data' ][ 'profileImage' ]);
        firstTime = true;
        previousImage = value[ 'data' ][ 'profileImage' ];
      });
    });
    this.getReplies();

  }

  getReplies() {
    let repliesSubscriber = this._study.getPostRepliesByID(this.studyID, this.id);
    if (this.isAnnotation) {
      repliesSubscriber = this._study.getAnnotationRepliesByID(this.studyID, this.chapterRef, this.id);
    }
    repliesSubscriber.subscribe((replies) => {
      this.replies = [];
      replies.forEach((reply) => {
        let firstTime = false;
        let firstReply = {};
        if (reply[ 'htmlText' ] === undefined || reply[ 'htmlText' ] === '') {
          reply[ 'htmlText' ] = reply[ 'text' ];
        }
        this._user.getDataFromID(reply[ 'creatorID' ]).subscribe((data) => {
          const profileImage = data[ 'data' ][ 'profileImage' ];
          reply[ 'image' ] = profileImage;
          reply[ 'name' ] = data[ 'name' ];
          reply[ 'subreplies' ] = [];
          this.getSubReplies(reply[ 'id' ]).subscribe((subreplies) => {
            reply[ 'subreplies' ] = [];
            subreplies.forEach((subreply) => {
              let firstSubReplyTime = false;
              let firstSubReply = {};
              this._user.getDataFromID(subreply[ 'creatorID' ]).subscribe((subData) => {
                const subProfileImage = subData[ 'data' ][ 'profileImage' ];
                if (subreply[ 'htmlText' ] === undefined || subreply[ 'htmlText' ] === '') {
                  subreply[ 'htmlText' ] = subreply[ 'text' ];
                }
                subreply[ 'image' ] = subProfileImage;
                subreply[ 'name' ] = subData[ 'name' ];
                if (firstSubReplyTime) {
                  reply[ 'subreplies' ][ reply[ 'subreplies' ].indexOf(firstSubReply) ] = subreply;
                } else {
                  reply[ 'subreplies' ].push(subreply);
                }
                firstSubReplyTime = true;
                firstSubReply = subreply;
              });
            });
          });
          if (firstTime) {
            this.replies[ this.replies.indexOf(firstReply) ] = reply;
          } else {
            this.replies.push(reply);
          }
          firstTime = true;
          firstReply = reply;
        });
      });
    });
  }


  getSubReplies(postID) {
    if (this.isAnnotation) {
      return this.afs.doc(`/studies/${ this.studyID }`)
        .collection('annotations').doc(this.chapterRef).collection('chapter-annotations').doc(this.id).collection('replies').doc(postID)
        .collection('subreplies', ref => ref.orderBy('timestamp', 'asc')).valueChanges();
    }
    return this.afs.doc(`/studies/${ this.studyID }`)
      .collection('posts').doc(this.id).collection('replies').doc(postID)
      .collection('subreplies', ref => ref.orderBy('timestamp', 'asc')).valueChanges();
  }
  addSubReply() {
    const firebaseID = this.afs.createId();
    const reply = new Reply(this.subReplyText, this.userID, Math.round((new Date()).getTime() / 1000), [], []);
    const jsonReply = Utils.toJson(reply);
    jsonReply[ 'id' ] = firebaseID;
    let ref = this.afs.doc(`/studies/${ this.studyID }`).collection('posts').doc(`${ this.id }`);
    if (this.isAnnotation) {
      ref = this.afs.doc(`/studies/${ this.studyID }`)
        .collection('annotations')
        .doc(this.chapterRef)
        .collection('chapter-annotations').doc(this.id);
    }
    if (!this.isAnnotation) {
      const updateContributor = ref.valueChanges().subscribe((val) => {
        if (val[ 'contributors' ].indexOf(reply.creatorID) === -1) {
          val[ 'contributors' ].push(reply.creatorID);
        }
        ref.update(val).then(() => {
          updateContributor.unsubscribe();
        });
      });
    }
    ref.collection('replies').doc(this.replyID).collection('subreplies').doc(firebaseID).set(jsonReply)
      .then(() => {
        this.toastr.show('Created Subreply', 'Succesfully Created Subreply');
        this.subReplyText = '';
      });
  }
  emitDelete() {
    this.delete.emit(true);
  }
  emitEdit() {
    this.edit.emit(true);
  }

  emitReply() {
    this.reply.emit(this.replyText);
    this.replyText = '';
  }

  @HostListener('mouseover') onMouseOver() {
    if (this.isLast) {
      this.more.emit(true);
    }
  }

}