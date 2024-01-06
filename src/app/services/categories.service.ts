import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Category } from './models/utils';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  URL_API=environment._urlApi


  constructor(private http:HttpClient) { }
  
  public getAll():Promise<Category[]>{
    return this.http.get<any>(this.URL_API + 'categories').toPromise()
  }

  //brands
  //categories

  //Get trae Todo
  //Post
  //Delete
}

