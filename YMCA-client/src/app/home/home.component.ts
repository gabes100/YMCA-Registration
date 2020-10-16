import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { User } from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;
  isStaff: Boolean;
  isMember: Boolean;

  constructor( 
    private router : Router,
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    this.data.currentUser.subscribe(user =>{
      this.user = <User>user;
    })

    this.isStaff = this.user.staff; 
    this.isMember = this.user.member; 
  }
  

  signUp(): void{
    const signUpBtn = document.getElementById('signUpBtn') as HTMLElement;
    signUpBtn.setAttribute('disabled', 'true');
  }
}