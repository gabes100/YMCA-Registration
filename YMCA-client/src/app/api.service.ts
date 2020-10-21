import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from './user';
import { Program } from './program';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  login(credentials) : Observable<User>{
    return this.http.post<User>('/api/login', credentials);
  }

  register(credentials) : Observable<User>{
    return this.http.post<User>('/api/register', credentials);
  }

  getPrograms() : Observable<Program[]>{
    return this.http.get<Program[]>('/api/programs');
  }

  createProgram(body) : Observable<Program>{
    return this.http.post<Program>('/api/program', body);
  }

  deleteProgram(id) : Observable<Object>{
    let params = new HttpParams();
    params = params.append('program', id);
    
    return this.http.delete<Object>('/api/program', {params : params});
  }
}
