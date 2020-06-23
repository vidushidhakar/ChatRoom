import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifs;
  useremail=localStorage.getItem('email');
  constructor(private ds:DataService) { }

  ngOnInit(): void {
    this.ds.getNotif({'email':this.useremail}).subscribe((response)=>{
      if(response.status=="ok")
        {
           
            this.notifs=response.data[0].friends.filter(function(s){
              if(s.recieved=="true" && s.state=="false")
              return s
            }); 
           console.log(this.notifs)
        }
    });
   
  }
  accept(friend){
    this.ds.acceptRequest({'email':this.useremail,'friendEmail':friend}).subscribe((response)=>{
    if(response.status=="ok"){
      alert("Friend Request Accepted!");
    }
    });
  }
}
