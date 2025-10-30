import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/user';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {}
  login(username: string, password: string) {
    return this.http.get<User[]>(`${this.api}?username=${username}&password=${password}`)
      .pipe(map(users => users.length ? users[0] : null));
  }
  signup(u: User) { return this.http.post<User>(this.api, u); }
  getAll() { return this.http.get<User[]>(this.api); }
}
