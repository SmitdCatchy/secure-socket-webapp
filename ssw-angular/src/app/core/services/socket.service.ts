import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { catchError, map, Observable, of, tap } from 'rxjs';
import * as crypto from 'crypto-js';
import { MatSnackBar } from '@angular/material/snack-bar';

const CipherOption = {
  mode: crypto.mode.CFB,
  padding: {
    pad: () => {},
    unpad: () => {}
  },
  segmentSize: 256
};

const IntegrityHeader = {
  alg: 'HMAC-SHA1'
};

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private privateKey: string;
  constructor(
    private readonly socket: Socket,
    private readonly snackBar: MatSnackBar
  ) {
    this.privateKey = 'unset';
  }

  public sendMessage(content: string): void {
    this.socket.emit('contentToServer', this.wrap(content));
  }

  public getToken$(): Observable<any> {
    return this.socket
      .fromEvent('tokenToClient')
      .pipe(tap((key: any) => (this.roomKey = key)));
  }

  public getMessage$(): Observable<any> {
    return this.socket.fromEvent('contentToClient').pipe(
      map((data: any) => this.unwrap(data)),
      catchError((err) => {
        this.snackBar.open(err, undefined, {
          duration: 2000
        });
        return of();
      })
    );
  }

  public getLatestContent$(): Observable<string> {
    return this.socket.fromEvent('latestContentToClient').pipe(
      map((data: any) => this.unwrap(data)),
      catchError((err) => {
        this.snackBar.open(err, undefined, {
          duration: 5000
        });
        return of();
      })
    );
  }

  public get key(): string {
    return this.privateKey;
  }

  public set roomKey(key: string) {
    this.privateKey = key;
  }

  private encrypt(content: string): string {
    return crypto.AES.encrypt(content, this.key, CipherOption).toString();
  }

  private decrypt(encrypted: string): string {
    return crypto.AES.decrypt(encrypted, this.key, CipherOption).toString(
      crypto.enc.Utf8
    );
  }

  private sign(data: string): string {
    const stringifiedHeader = crypto.enc.Utf8.parse(
      JSON.stringify(IntegrityHeader)
    );
    const encodedHeader = this.base64url(stringifiedHeader);
    const token = `${encodedHeader}.${data}`;
    const signature = crypto.HmacSHA1(token, this.key);
    return `${token}.${signature}`;
  }

  private decode(token: string): string {
    const [header, data, signature] = token.split('.');
    const checkToken = `${header}.${data}`;
    const signatureCheck = `${crypto.HmacSHA1(checkToken, this.key)}`;

    if (signatureCheck !== signature) {
      throw new Error('Invalid Signature');
    }
    return data;
  }

  private base64url(source: crypto.lib.WordArray): string {
    let encodedSource = crypto.enc.Base64.stringify(source)
      .replace(/=+$/, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    return encodedSource;
  }

  private wrap(content: string): string {
    return this.sign(this.encrypt(content));
  }

  private unwrap(content: string): string {
    return this.decrypt(this.decode(content));
  }
}
