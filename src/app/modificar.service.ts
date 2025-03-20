import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { registroVo } from './pojos/registroVo.modelo';

@Injectable({
  providedIn: 'root'
})
export class ModificarService {

  // URL base del backend
  private apiUrl = 'http://192.166.11.130:3000/api/modificar';
  
  // Constructor con inyección de HttpClient
  constructor(private http: HttpClient) { }

  // Método para eliminar los datos por el correo
  eliminarDatosModificar(correo: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar/${correo}`);
  }

  // Método para obtener los datos de un proveedor por su correo
  obtenerDatosCorreo(correo: string): Observable<registroVo> {
    return this.http.get<registroVo>(`${this.apiUrl}/${correo}`);

  }

  // Método para enviar los datos de modificación
  enviarDatosModificar(registroVo: registroVo): Observable<any> {
    console.log('Enviar datos del registro', registroVo);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(`${this.apiUrl}/modifiacar`, registroVo, { headers });
  }

  // Método para modificar los datos de un paciente
  modificarDatosPaciente(registroVo: registroVo, encodedCorreo: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('Enviando datos con encabezados:', headers);
    return this.http.put<any>(`${this.apiUrl}/${encodedCorreo}`, registroVo, { headers });


  }
}
