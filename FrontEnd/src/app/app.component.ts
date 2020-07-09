import { Component } from '@angular/core';
import { DataService } from './data.service';
import { MySocketService } from './my-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontEnd';

  constructor(private router:Router, private ds:DataService, private socketSerrvice:MySocketService) { }

  ngOnInit(): void {

    if(localStorage.getItem('email')){
      this.socketSerrvice.setupSocketConnection();
        this.ds.getNotif({'email':localStorage.getItem('email')}).subscribe((response)=>{
      if(response.status=="ok")
        {
            this.socketSerrvice.setAllMyFriends(response.data[0].friends)
           
        }
    });

     
    }

  }

}
