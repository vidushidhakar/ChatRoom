import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
 
  nameProp;
  emailProp;
  passwordProp;
  LnameProp;
  FnameProp;
  locationProp;
  constructor(private ds:DataService, private router:Router) { }

  ngOnInit(): void {
  }



  signUP()
{ if(this.FnameProp && this.LnameProp && this.nameProp && this.emailProp && this.passwordProp && this.locationProp){
      this.ds.signUp({firstname:this.FnameProp,lastname:this.LnameProp,username:this.nameProp, email:this.emailProp, password:this.passwordProp,location:this.locationProp,friends:[]})
      .subscribe((response)=>{
        if(response.status=="ok")
        {
           
            alert("Sign Up Successfull you will be redirected to sign in ");
            this.router.navigate(['/']);
        }
        else{
          alert("Account from this email already exist!!")
        }
      })
  }
  else{
    alert("Fill all fields")
  }

}



}
