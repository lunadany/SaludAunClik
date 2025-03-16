import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
  data: any[] = []; // Aquí guardaremos los datos de la API

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.datosTabla();
  }

  datosTabla(): void {
    this.dataService.getDatos().subscribe({
      next: (response: any[]) => {
        console.log('Datos recibidos:', response);
        this.data = response;
      },
      error: (err: any) => {
        console.error('❌ Error al obtener los datos:', err);
      }
    });
  }
}
