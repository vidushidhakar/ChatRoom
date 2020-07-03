import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MySocketService } from '../my-socket.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifs;
  realtimeNotifs;
  useremail=localStorage.getItem('email');
  constructor(private ds:DataService ,private ss:MySocketService) { }

  ngOnInit(): void {
    this.ds.getNotif({'email':this.useremail}).subscribe((response)=>{
      if(response.status=="ok")
        {
           
            this.notifs=response.data[0].friends.filter(function(s){
              if(s.recieved==true && s.status==false)
              return s
            }); 
           console.log(this.notifs)
        }
    });
   this.realtimeNotifs=this.ss.allnotifs;
   
  }
  accept(friend){
    this.ds.acceptRequest({'email':this.useremail,'friendEmail':friend}).subscribe((response)=>{
    if(response.status=="ok"){
      alert("Friend Request Accepted!");
      //location.reload();
    }
    });
  }
}
