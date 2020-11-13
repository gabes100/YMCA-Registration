import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { Program } from '../program';
import { FormControl, FormGroup} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

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
  programId : string;

  debug: Boolean = false; //REMOVE THIS BEFORE SUBMIT
  
  constructor( 
    private router : Router,
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user-login'));
  
    if (!this.user){
      this.router.navigate(['/']);
    }


    this.isStaff = this.user.staff; 
    this.isMember = this.user.member;

    this.updateView();

    this.programForm = new FormGroup({
      _id: new FormControl(''),
      programName: new FormControl(''),
      location: new FormControl(''),
      description: new FormControl(''),
      fee: new FormControl(''),
      capacity: new FormControl(''),
      day: new FormControl(''),
      timeStart: new FormControl(''),
      timeEnd: new FormControl(''),
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

    this.api.signUp(this.user['_id'], {programid : this.programId}).subscribe(result =>{
      console.log(result);
     });

     this.updateView();
  }

  updateView(): void{
    this.api.getPrograms().subscribe(programs =>{
      this.programs = programs;
    });
  }

  openProgamModal(data : Program): void {
    const discount = Math.ceil(<number>data.fee *  0.5);
    const fee = this.isMember ? discount: data.fee;

     this.programViewForm.patchValue({
      fee: "$" + fee + ".00",
      capacity: data.capacity,
      description: data.description,
     });

     this.programId = data['_id'];
  }

  resetForm(formName: FormGroup): void {
    formName.reset();
  }

  openModifyModal(data : Program): void {
    this.programId = data['_id'];
    this.isModding = true;
    //TODO Figure out date format
    this.programForm.patchValue({
      programName: data.name,
      location: data.location,
      description: data.description,
      day: data.day,
      fee: data.fee,
      capacity: data.capacity,
      timeStart: data.time.substring(0,data.time.indexOf('-')),
      timeEnd: data.time.substring(data.time.indexOf('-')+2),
      dateStart: data.date.substring(0,data.date.indexOf('-')),
      dateEnd: data.date.substring(data.date.indexOf('-')+2)
    });
 }

  createDate(inputDate: string) : string {
    const year = inputDate.substring(0, inputDate.indexOf("-"));
    const month = inputDate.substring(inputDate.indexOf("-") +1, inputDate.lastIndexOf("-"));
    const day = inputDate.substring(inputDate.lastIndexOf("-") + 1);

    return month + "/" + day + "/" + year;
  }

  createTime(inputTime: string) : string {
    const hour = inputTime.substring(0,  inputTime.indexOf(":"));
    const minute = inputTime.substring(inputTime.indexOf(":")); //has ':' in it still
    const hourValue:number = +hour;

    let retTime = "";
    
    if (hourValue < 12&& hourValue != 0){
      retTime = hourValue  + minute + "am"
    } else if (hourValue  == 12) {
      retTime = "12" + minute + "pm";
    } else if (hourValue  == 0 || hourValue  == 24) {
      retTime = "12" + minute + "am";
    }else{
      retTime = hourValue - 12 +  minute + "pm";
    }
    return retTime;
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

  updateProgram() : void {

    console.log(this.programForm.controls['dateStart'].value);
    let body = {
      name : this.programForm.controls['programName'].value,
      location : this.programForm.controls['location'].value,
      description : this.programForm.controls['description'].value,
      fee : this.programForm.controls['fee'].value,
      capacity : this.programForm.controls['capacity'].value,
      time : this.createTime(this.programForm.controls['timeStart'].value)  + " - " + this.createTime(this.programForm.controls['timeEnd'].value),
      day : this.programForm.controls['day'].value,
      date : this.createDate(this.programForm.controls['dateStart'].value) + " - " + this.createDate(this.programForm.controls['dateEnd'].value)
    };

    if(this.isModding){
      this.api.modifyProgram(this.programId, body).subscribe(newProgram =>{
        console.log(newProgram);
      });
    }
    else{
      this.api.createProgram(body).subscribe(newProgram =>{
        console.log(newProgram);
      });
    }

    this.updateView();

    // window.location.reload(); //reload data
  }
}