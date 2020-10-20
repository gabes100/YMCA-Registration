import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { Program } from '../program';
import { FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;
  isStaff: Boolean;
  isMember: Boolean;
  isModding: Boolean;
  programs : Program[];
  programForm: FormGroup;
  programViewForm: FormGroup;
  
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

    this.programForm = new FormGroup({
      programName: new FormControl(''),
      location: new FormControl(''),
      description: new FormControl(''),
      inputDay: new FormControl(''),
      fee: new FormControl(''),
      capacity: new FormControl(''),
      inputTime: new FormControl(''),
      dateStart: new FormControl(''),
      dateEnd: new FormControl('')
    });

    this.programViewForm = new FormGroup({
      description: new FormControl(''),
      fee: new FormControl(''),
      capacity: new FormControl(''),
    });

    this.isModding = false;
  }
  

  signUp(): void{
    //const signUpBtn = document.getElementById('signUpBtn') as HTMLElement;
    //signUpBtn.setAttribute('disabled', 'true');
  }

  openProgamModal(data : Program): void {
     this.programViewForm.patchValue({
      fee: "$" + data.fee + ".00",
      capacity: data.capacity,
      description: data.description,
     });
  }

  resetForm(formName: FormGroup): void {
    formName.reset();
  }

  openModifyModal(data : Program): void {
    this.isModding = true;
    //TODO Figure out date format
    this.programForm.patchValue({
      programName: data.name,
      location: data.location,
      description: data.description,
      inputDay: data.day,
      fee: data.fee,
      capacity: data.capacity,
      inputTime: data.time,
      dateStart: data.date.substring(0,data.date.indexOf('-')),
      dateEnd: data.date.substring(data.date.indexOf('-')+2)
    });
 }

 openCreateModal(): void {
  this.isModding = false;
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