import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { User } from '../user';
import { Program } from '../program';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {
  user: User;
  programs : Program[];

  constructor( 
    private router : Router,
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user-login'));

    this.api.getUserPrograms(this.user['_id']).subscribe(programs =>{
      this.programs = programs;
    });
  }

}
