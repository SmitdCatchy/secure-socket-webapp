import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { Room } from 'src/app/core/models/room.model';
import { SocketService } from 'src/app/core/services/socket.service';

@Component({
  selector: 'ssw-room-page',
  templateUrl: './room-page.component.html',
  styleUrls: ['./room-page.component.scss']
})
export class RoomPageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription;
  public contentForm: FormGroup;
  public room: Room;
  public logs: string[];

  constructor(private readonly socketService: SocketService) {
    this.subscriptions = new Subscription();
    this.contentForm = new FormGroup({
      secretContent: new FormControl('')
    });
    this.room = {
      name: 'Room not found'
    };
    this.logs = [];
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.contentForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe((res) => this.socketService.sendMessage(res.secretContent))
    );
    this.subscriptions.add(
      this.socketService
        .getMessage$()
        .subscribe((res) =>
          this.contentForm.setValue(
            { secretContent: res },
            { emitEvent: false }
          )
        )
    );
    this.subscriptions.add(
      this.socketService
        .getToken$()
        .subscribe((key) => this.logs.push(`Private key: ${key}`))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
