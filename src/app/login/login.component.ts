import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [ FormsModule, CommonModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    console.log(this.showPassword);  // Asegúrate de que se esté cambiando
  }
  

  onSubmit() {
    if (!this.username || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, complete todos los campos.',
        confirmButtonColor: '#A11A5C',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    const validUsername = 'Doctor Camacho';
    const validPassword = 'Doctor Camacho';

    if (this.username !== validUsername || this.password !== validPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Credenciales no válidas',
        text: 'Usuario o contraseña incorrectos.',
        confirmButtonColor: '#04B404',
        confirmButtonText: 'Intentar de nuevo'
      });
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Credenciales válidas',
      text: 'Accediendo al sistema...',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = 'http://localhost:4200/fechas';
      }
    });
  }
}

