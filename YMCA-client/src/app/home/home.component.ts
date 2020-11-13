import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { User } from '../user';
import { Program } from '../program';
import { FormControl, FormGroup} from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { faSun } from '@fortawesome/free-regular-svg-icons';

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
      monday: new FormControl(''),
      tuesday: new FormControl(''),
      wednesday: new FormControl(''),
      thursday: new FormControl(''),
      friday: new FormControl(''),
      saturday: new FormControl(''),
      sunday: new FormControl(''),
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
      fee: data.fee,
      capacity: data.capacity,
      timeStart: data.startTime,
      timeEnd: data.endTime,
      dateStart: data.startDate,
      dateEnd: data.endDate,
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

    let days = [];

    const mon = this.programForm.controls['monday'].value ? "Mon" : null;
    const tues = this.programForm.controls['tuesday'].value ? "Tues" : null;
    const wed = this.programForm.controls['wednesday'].value ? "Wed" : null;
    const thur = this.programForm.controls['thursday'].value ? "Thurs" : null;
    const fri = this.programForm.controls['friday'].value ? "Fri" : null;
    const sat = this.programForm.controls['saturday'].value ? "Sat" : null;
    const sun = this.programForm.controls['sunday'].value ? "Sun" : null;

    if (mon) days.push(mon);
    if (tues) days.push(tues);
    if (wed) days.push(wed);
    if (thur) days.push(thur);
    if (fri) days.push(fri);
    if (sat) days.push(sat);
    if (sun) days.push(sun);
  

    let body = {
      name : this.programForm.controls['programName'].value,
      location : this.programForm.controls['location'].value,
      description : this.programForm.controls['description'].value,
      fee : this.programForm.controls['fee'].value,
      capacity : this.programForm.controls['capacity'].value,
      startTime : this.createTime(this.programForm.controls['timeStart'].value),
      endTime: this.createTime(this.programForm.controls['timeEnd'].value),
      startDate : this.createDate(this.programForm.controls['dateStart'].value),
      endDate : this.createDate(this.programForm.controls['dateEnd'].value),
      day : days,
    };

    if(this.isModding){
      this.api.modifyProgram(this.programId, body).subscribe();
    }
    else{
      this.api.createProgram(body).subscribe();
    }

    this.updateView();

    // window.location.reload(); //reload data
  }
}