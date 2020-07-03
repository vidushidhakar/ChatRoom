import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EmailValidator } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class MySocketService {
  baseURL = "http://localhost:3000";
  SOCKET_ENDPOINT = 'http://localhost:3000/'
  socket;

  currentSelectedUser = new BehaviorSubject(null);
  currentMsg = new BehaviorSubject(null);
  allUsers= new Array(); 
  allnotifs= new Array();


  constructor(private http: HttpClient) {   }

  setupSocketConnection() {
    //alert("sending socket request");
    this.socket = io(this.SOCKET_ENDPOINT,{
                                              query: {
                                                email: localStorage.getItem('email')
                                              }
                     });

    console.log("socket connection stablished");
     console.log(this.socket)
     this.socket.on('newNotif', (d)=>{ this.recieveNotif(d) }  )
    this.socket.on('newMsg', (d)=>{ this.recieveNewMsg(d) }  )
    this.socket.on('connectedUsersEmail', (d)=>{this.processAllConnectedUsers(d)})
    this.socket.on('newUserLoggedIn', (d)=>{ this.addNewUser(d) })
    this.socket.on('disconnectedUser', (d)=>{ this.deleteUser(d) })
    
  }



  sendNotif(data):any
  {
      console.log("sending to "+data.friend);
      this.socket.emit('newNotif', {to:data.friend, from:data.email });
     return this.http.post(this.baseURL+"/add-friend", data);
  }

  recieveNotif(data)
  {  
      console.log("new notif");
      console.log(data);
    this.allnotifs.push({email:data.from,friendrequest:true,newMsg:0})

      console.log(JSON.stringify(this.allnotifs)) 
  }




recieveNewMsg(data)
{
    console.log("new msg Details");
    console.log(data);
   
    // alert(JSON.stringify(data));
    //this.currentMsg.next(data);

  if(data.from!=this.currentSelectedUser){
        if(this.allnotifs.some(u => u.email ==data.from)){
      this.allnotifs.forEach((u)=>{ 
          if(u.email == data.from)
          {//console.log(u.email,data.from)
            u.newMsg=u.newMsg+1
           
          }
    
        })
        } 
  
       else{
        this.allnotifs.push({email:data.from,friendrequest:false,newMsg:1})
        }
    }


    this.allUsers.forEach((u)=>{ 
      if(u.email == data.from)
      { 
        u.msg.push({text:data.text, isMine:false});
        
        // this.currentMsg.next(data);
      }

    })
    console.log(JSON.stringify(this.allUsers));
}



sendNewMsg(data)
{
    console.log("new msg Details");
    console.log("sending to "+this.currentSelectedUser.value.email);
    console.log(data);
    this.allUsers.forEach((u)=>{ 
      if(u.email == this.currentSelectedUser.value.email)
      {
        u.msg.push({text:data, isMine:true});
      }

    })
    this.socket.emit('newMsg', {to:this.currentSelectedUser.value.email, text:data, from:localStorage.getItem('email') });
   

    console.log(JSON.stringify(this.allUsers));


}



setAllMyFriends(d)
{

  d.forEach((u)=>{
    if(u.status){
    this.allUsers.push({email:u.name, msg:[], isOnline:false})}
  })

}


processAllConnectedUsers(d)
{
    d.forEach((connectedUserToServer)=>{

      
      this.allUsers.forEach((myfriend)=>{

        if(myfriend.email==connectedUserToServer)
        {
          myfriend.isOnline= true;
        }
      })
    })

   
}

addNewUser(data)
{
    console.log("new User Details");
    console.log(data);
    
    this.allUsers.forEach((myfriend)=>{
      if(myfriend.email==data)
      {
         myfriend.isOnline=true;
      }
    })

    
    
}

deleteUser(data)
{
    console.log("Offline User Details");
    console.log(data);
    
    this.allUsers.forEach((myfriend)=>{
      if(myfriend.email==data)
      {
         myfriend.isOnline=false;
      }
    })
}



}
