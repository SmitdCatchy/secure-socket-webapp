import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private readonly socketService: SocketService,
    private readonly route: ActivatedRoute
  ) {
    this.subscriptions = new Subscription();
    this.contentForm = new FormGroup({
      secretContent: new FormControl('')
    });
    this.room = {
      name: 'Private Room',
      owner: false
    };
    this.logs = [];
  }

  ngOnInit(): void {
    const roomKey = this.route.snapshot.params['token'];
    if (roomKey) {
      this.socketService.roomKey = roomKey;
      this.logs.push(`Joined room`);
      this.subscriptions.add(
        this.socketService
          .getLatestContent$()
          .subscribe((res) => this.updateContent(res))
      );
    } else {
      this.room.owner = true;
      this.subscriptions.add(
        this.socketService
          .getToken$()
          .subscribe((key) => this.logs.push(`Created room`))
      );
    }
    this.subscriptions.add(
      this.contentForm.valueChanges
        .pipe(debounceTime(500))
        .subscribe((res) => this.socketService.sendMessage(res.secretContent))
    );
    this.subscriptions.add(
      this.socketService
        .getMessage$()
        .subscribe((res) => this.updateContent(res))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private updateContent(content: string): void {
    this.contentForm.setValue({ secretContent: content }, { emitEvent: false });
  }

  public copyJoinLink(): void {
    navigator.clipboard.writeText(
      `http://localhost:4200/room/${this.socketService.key}`
    );
  }
}
