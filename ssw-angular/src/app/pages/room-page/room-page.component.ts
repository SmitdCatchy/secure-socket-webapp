import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { Room } from 'src/app/core/models/room.model';

@Component({
  selector: 'ssw-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  public contentForm: FormGroup;
  public room: Room;

  constructor() {
    this.subscriptions = new Subscription();
    this.contentForm = new FormGroup({
      secretContent: new FormControl('')
    });
    this.room = {
      name: 'Room not found'
    };
    this.subscriptions.add(
      this.contentForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe((res) => console.log(res))
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
