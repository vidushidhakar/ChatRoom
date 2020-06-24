import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class MySocketService {

  SOCKET_ENDPOINT = 'http://localhost:3000/'
  socket;
  constructor() {   }

  setupSocketConnection() {
    alert("sending socket request");
    this.socket = io(this.SOCKET_ENDPOINT,{
      query: {
        email: localStorage.getItem('email')
      }
    });

    console.log(this.socket)
  }

}
