import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  // login(credentials) : Observable<User>{
  //   return this.http.post<User>('/api/v1/login', credentials);
  // }
}
