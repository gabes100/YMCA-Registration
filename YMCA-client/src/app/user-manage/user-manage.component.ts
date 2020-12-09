import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { DataService } from '../data.service';
import { User } from '../user';

@Component({
  selector: 'app-user-manage',
  templateUrl: './user-manage.component.html',
  styleUrls: ['./user-manage.component.css']
})
export class UserManageComponent implements OnInit {
  searchForm: FormGroup;
  userForm: FormGroup;
  users: User[];
  isModding: boolean;
  userId: any;

  constructor(
    private router : Router,
    private api : ApiService,
    private data : DataService) { }

  ngOnInit(): void {
    
    this.searchForm = new FormGroup({
      searchInput: new FormControl('')
    });

    this.isModding = false;

    this.updateView();
  }


  updateOrCreateProgram() : void {

  }

  removeUser(id: string) : void {
    this.api.deleteUser(id).subscribe(user =>{
      console.log(user);
    })
  }

 
  /* updateView
  /  Updates users from the database
  */
  updateView(): void{
    this.api.getUsers().subscribe(users =>{
      this.users = users;
    });
  }

  /* searchByName
  / Search users by name
  */
  searchByName() : void {
    const searchString = this.searchForm.get("searchInput").value?.toString().toLowerCase();
    if (searchString) {
      const result = this.users.filter(user => user.firstName.toLowerCase().includes(searchString));
      this.users = result;
    }
  }

  /* clearFilter
  / clears the search filter
  */
  clearFilter() : void {
    this.resetForm(this.searchForm);
    this.updateView();
  }

  /* openRemoveModal
  /  Passes the data to the modal for removing a user
  */
  openRemoveModal(data: User): void {
    this.userId = data['_id'];
  }

  /* openCreateModal
  /  Passes the data to the modal for creating a user
  */
  openCreateModal(): void {
    this.isModding = false;
  }

  /* openModifyModal
  /  Passes the data to the modal for modifing a user as well as patching values to the form
  */
  openModifyModal(data : User): void {
    this.userId = data['_id'];
    this.isModding = true;
  }

  /* resetForm
  /  Resets a form given a form name
  */
  resetForm(formName: FormGroup): void {
    formName.reset();
  }
}
