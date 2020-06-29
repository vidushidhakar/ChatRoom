import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { MySocketService } from '../my-socket.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts;
  useremail=localStorage.getItem('email')
  constructor(private ds:DataService, private ss:MySocketService) { }

  ngOnInit(): void {
   $("#contacts").on("click",function(){ alert("hii");$("#contacts a person-add i").removeClass("active"),$(this).addClass("active")})
    


    this.ds.getNotif({'email':this.useremail}).subscribe((response)=>{
      if(response.status=="ok")
        {
           
            this.contacts=response.data[0].friends.filter(function(s){
              if(s.status==true)
              return s;
            }); 
           console.log(this.contacts)
        }
    });
    
  }

  setCurrentUser(c)
  {
      this.ss.currentSelectedUser.next(c);
  }

}
