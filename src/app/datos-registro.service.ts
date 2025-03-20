import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { registroVo } from './pojos/registroVo.modelo';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DatosRegistroService {
  // eliminarDatosModificar(correo: string): Observable<any> {
  //   return this.http.delete<any>(`${this.apiUrl}/eliminar/${correo}`);
  // }

  // Propiedad privada que contiene la URL base del backend.
  private apiUrl = 'http://192.166.11.130:3000/api/registro'; //registro

  // Constructor que inyecta el servicio HttpClient.
  constructor(private http: HttpClient) { }

  // Método para enviar datos del registro.
  obtenerdatosRegistro(correo: string): Observable<registroVo> {
    return this.http.get<registroVo>(`${this.apiUrl}/${correo}`);
  }

    // Método corregido para obtener un correo (si es necesario)
    getcorreo(correo: string): Observable<any> {
      const url = `${this.apiUrl}/${correo}`;
      return this.http.get<any>(url);
    }

  // Método para enviar datos del registro
  enviarDatosRegistro(registroVo: registroVo): Observable<any> {
    console.log('Enviar datos del registro', registroVo);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/registro`, JSON.stringify(registroVo), { headers });
  }
}