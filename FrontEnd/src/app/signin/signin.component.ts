import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  emailProp;
  passwordProp;
  constructor(private router:Router, private ds:DataService) { }

  ngOnInit(): void {
  }

  signin()
  {
      this.ds.signIn({email:this.emailProp, password:this.passwordProp})
      .subscribe((response)=>{
        if(response.status=="ok")
        {

          localStorage.setItem('email', response.data[0].email);
          localStorage.setItem('password', response.data[0].password);
          localStorage.setItem('username', response.data[0].username);
          localStorage.setItem('firstname', response.data[0].firstname);
          localStorage.setItem('lastname', response.data[0].lastname);
          localStorage.setItem('location', response.data[0].location);
          this.router.navigate(['/chat-window']); 

        }
      })
  }

}
