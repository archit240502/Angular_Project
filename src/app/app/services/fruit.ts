import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Fruit } from '../../models/fruit';

@Injectable({
  providedIn: 'root',
})
export class FruitService {
  private api = 'http://localhost:3000/fruits';
  constructor(private http: HttpClient) {}
  
  getAll(): Observable<Fruit[]> { 
    return this.http.get<Fruit[]>(this.api); 
  }
  
  getById(id: number | string): Observable<Fruit> { 
    return this.http.get<Fruit>(`${this.api}/${id}`); 
  }
  
  add(f: Fruit): Observable<Fruit> { 
    return this.http.post<Fruit>(this.api, f); 
  }
  
  update(f: Fruit): Observable<Fruit> { 
    return this.http.put<Fruit>(`${this.api}/${f.id}`, f); 
  }
  
  delete(id: number | string): Observable<void> { 
    return this.http.delete<void>(`${this.api}/${id}`); 
  }

  // Health check method
  healthCheck(): Observable<any> {
    return this.http.get('http://localhost:3000/fruits?_limit=1');
  }
}
