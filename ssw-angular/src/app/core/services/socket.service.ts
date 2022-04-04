import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map, Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private privateKey: string;
  constructor(private readonly socket: Socket) {
    this.privateKey = 'unset';
  }

  public sendMessage(msg: string): void {
    this.socket.emit('msgToServer', msg);
  }

  public getToken$(): Observable<any> {
    return this.socket
      .fromEvent('tokenToClient')
      .pipe(tap((key: any) => (this.privateKey = key)));
  }

  public getMessage$(): Observable<any> {
    return this.socket.fromEvent('msgToClient').pipe(map((data: any) => data));
  }
}
