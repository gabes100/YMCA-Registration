import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { Program } from '../program';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;
  isStaff: Boolean;
  isMember: Boolean;
  programs : Program[];

  constructor( 
    private router : Router,
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    this.data.currentUser.subscribe(user =>{
      this.user = <User>user;
    });

    this.isStaff = this.user.staff; 
    this.isMember = this.user.member; 

    this.api.getPrograms().subscribe(programs =>{
      this.programs = programs;
    });
  }
  

  signUp(): void{
    const signUpBtn = document.getElementById('signUpBtn') as HTMLElement;
    signUpBtn.setAttribute('disabled', 'true');
  }

  removeProgram() : void{
    // TODO: Need to get id of program we are deleting
    
    // Used to test server call. Id changes everytime.
    let id = "5f8d4d6309b28f3929c16552";

    this.api.deleteProgram(id).subscribe(result =>{
      if(result['deletedCount'] > 0){
        alert("Delete successful!");
      }
      else{
        alert("Delete failed!");
      }
    })
  }
}