import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { register } from 'module';
import { DatosRegistroService } from './datos-registro.service';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private apiUrl = 'http://192.166.11.130:3000/api/tabla'; //trabla

  constructor(private http: HttpClient) { }



// getDatos(correo: string): Observable<any> {
//   const url = `${this.apiUrl}/${correo}`;
//   return this.http.get<any>(url);
getDatos(): Observable<any[]> {  // ❌ Eliminamos el parámetro 'correo'
  return this.http.get<any[]>(this.apiUrl);
}

}


//   getQuery(query: string, url: string) {
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
//     return this.http.get(url + '' + query, { headers });
//   }

//   getData(): Observable<any[]> {
//   let url = `${this.apiUrl}/tabla`;
//   return this.http.get(url).pipe(map((data: any) => data));
//   }
