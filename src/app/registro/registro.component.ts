import { Component, Input } from '@angular/core';
import { registroVo } from '../pojos/registroVo.modelo';
import { DatosRegistroService } from '../datos-registro.service';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './registro.component.html', // Asegúrate de que la ruta sea correcta
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  motivos = [
    { value: 'revision', label: 'Revisión Dental General', tiempo: 30 },
    { value: 'limpieza', label: 'Limpieza Dental (Profilaxis)', tiempo: 45 },
    { value: 'dolor', label: 'Consulta por Dolor Dental', tiempo: 60 },
    { value: 'ortodoncia', label: 'Ortodoncia (Revisión o Tratamiento de Brackets)', tiempo: 40 },
    { value: 'endodoncia', label: 'Endodoncia (Tratamiento de Conductos)', tiempo: 90 },
    { value: 'cirugia', label: 'Cirugía Dental (Extracciones)', tiempo: 120 },
    { value: 'implantes', label: 'Implantes Dentales', tiempo: 120 },
    { value: 'blanqueamiento', label: 'Blanqueamiento Dental', tiempo: 60 },
    { value: 'pediatria', label: 'Consulta Infantil', tiempo: 30 },
    { value: 'periodoncia', label: 'Tratamiento de Encías (Periodoncia)', tiempo: 60 },
    { value: 'urgencias', label: 'Urgencia Dental', tiempo: 45 },
  ];
  selectedMotivo: string = '';
  duracion: number | null = null;
  fechaCita: string = '';
  horaCita: string = '';
  loading: boolean = false;

  @Input() registroVo: registroVo;
  constructor(private datosRegistroService: DatosRegistroService) {
    this.registroVo = new registroVo();
  }
  datosCargados: boolean = false; // Estado inicial
  onMotivoChange(event: Event): void {
    const motivo = this.motivos.find((m) => m.value === this.selectedMotivo);
    this.duracion = motivo ? motivo.tiempo : null;
  }
  guardarCita(): void {
    if (this.loading) return; // Evita múltiples envíos
    if (!this.registroVo.diaCita || !this.registroVo.horaCita) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, seleccione una fecha y una hora.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return; // 🚨 DETIENE la ejecución
    }
    if (!this.validarHorario()) {
      Swal.fire({
        title: 'Horario no válido',
        text: 'Seleccione una hora dentro del horario de atención.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return; // 🚨 DETIENE la ejecución si el horario es incorrecto
    }
    if (this.esCitaDuplicada()) {
      Swal.fire({
        title: 'Cita Duplicada',
        text: 'Esta cita ya está reservada. Elija otra hora.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return; // 🚨 DETIENE la ejecución si la cita ya existe
    }
    this.loading = true;
    // Simula un retraso antes de enviar los datos
    setTimeout(() => {
      this.enviarDatosRegistro(); // ✅ Solo se ejecuta si pasó las validaciones
      this.loading = false;
    }, 1000);
  }
  
  descargarPDF(): void {
    if (!this.registroVo.diaCita || !this.registroVo.horaCita) {
      alert('Por favor, seleccione una fecha y una hora.');
      return;
    }
    if (!this.validarHorario()) {
      alert('Horario no válido. Seleccione una hora dentro del horario de atención.');
      return; // 🔴 DETIENE la ejecución si la hora no es válida
    }
    if (this.esCitaDuplicada()) {
      alert('Esta cita ya está reservada. Elija otra hora.');
      return; // 🔴 DETIENE la ejecución si la cita ya existe
    }
    // Guardar la cita en la lista de reservadas
    this.citasReservadas.push({
      dia: this.registroVo.diaCita,
      hora: this.registroVo.horaCita
    });
    // Mostrar duración estimada
    this.duracion = 30;
  
    alert('Cita reservada con éxito. Generando PDF...');
  
    // Código para descargar el PDF
    const url = '../portada1.pdf'; // Ruta al PDF en la carpeta assets
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pago_cliente.pdf';
    link.click();
  }
  enviarDatosRegistro(): void {
    console.log('Datos a enviar:', this.registroVo);  // Verifica los valores en consola
  
    // Expresión regular para validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Verifica si algún campo está vacío
    if (!this.registroVo.correo || !this.registroVo.apellidoPaterno || !this.registroVo.apellidoMaterno || 
        !this.registroVo.nombre || !this.registroVo.telefono || !this.registroVo.alergias || 
        !this.registroVo.sexo || !this.registroVo.motivoConsulta || !this.registroVo.diaCita || 
        !this.registroVo.horaCita) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos del formulario.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    // Validar formato de correo
    if (!emailRegex.test(this.registroVo.correo)) {
      Swal.fire({
        title: 'Correo no válido',
        text: 'Por favor, ingresa un correo electrónico válido.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    // 🚨 Validar horario antes de guardar en la BD
    if (!this.validarHorario()) {
      Swal.fire({
        title: 'Horario no válido',
        text: 'Seleccione una hora dentro del horario de atención.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return; // 🚨 DETIENE el registro si el horario es inválido
    }
  
    // Enviar los datos al servicio solo si el horario es válido
    this.datosRegistroService.enviarDatosRegistro(this.registroVo).subscribe(
      (response) => {
        console.log('Datos enviados correctamente', response);
        Swal.fire({
          title: 'Registro exitoso!',
          text: 'Tu solicitud de cita ha sido recibida y se está procesando.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
        this.resetForm();
      },
      (error) => {
        console.error('Error al enviar los datos:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al enviar los datos. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    );
  }
  
  /// Método para obtener los datos
  obtenerdatosRegistro(): void {
    if (!this.registroVo.correo) {
      console.error("El correo es necesario para obtener los datos");
      return;
    }
    
    this.datosRegistroService.obtenerdatosRegistro(this.registroVo.correo).subscribe(
      (data: { correo: string; apellidoPaterno: string; apellidoMaterno: string; nombre: string; telefono: string; }) => {
        this.datosCargados = true; // Bloquea los campos después de obtener datos
      },
      (error) => {
        console.error("Error al obtener los datos del registro", error);
      }
    );
  }
 private resetForm(): void {
    this.registroVo = new registroVo(); // Resetea los valores del objeto
    this.selectedMotivo = '';
    this.duracion = null;
    this.fechaCita = '';
    this.horaCita = '';
    this.registroVo = new registroVo(); // Suponiendo que RegistroVo es la clase correcta
  }
  correoInvalido: boolean = false; // Control para mostrar error
  validarCorreo(): void {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
    if (!emailPattern.test(this.registroVo.correo)) {
      this.correoInvalido = true;

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: 'Correo inválido',
        text: 'Por favor, ingresa un correo válido.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });

      this.registroVo.correo = ''; // Limpiar el campo si es inválido
    } else {
      this.correoInvalido = false;
    }
  }
  telefonoInvalido: boolean = false; // Control para mostrar error
  validarTelefono(): void {
    const telefonoPattern = /^[0-9]{10}$/; // Solo 10 dígitos numéricos

    if (!telefonoPattern.test(this.registroVo.telefono)) {
      this.telefonoInvalido = true;

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: 'Teléfono inválido',
        text: 'El número de teléfono debe tener exactamente 10 dígitos numéricos.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });

      this.registroVo.telefono = ''; // Limpiar el campo si es inválido
    } else {
      this.telefonoInvalido = false;
    }
  }
  citasReservadas: { dia: string, hora: string }[] = [];
  validarHorario(): boolean {
    if (!this.registroVo.horaCita) return false; // Si no hay hora, es inválido
  
    const [hora, minutos] = this.registroVo.horaCita.split(':').map(Number);
    const diaSeleccionado = new Date(this.registroVo.diaCita).getDay(); // 0 = Domingo, ..., 6 = Sábado
  
    if (isNaN(hora) || isNaN(minutos)) return false; // Evita valores no numéricos
  
    if (diaSeleccionado >= 1 && diaSeleccionado <= 5) {
      // Lunes a Viernes: 9:00 - 19:00
      return (hora > 9 || (hora === 9 && minutos >= 0)) && (hora < 19 || (hora === 19 && minutos === 0));
    } else if (diaSeleccionado === 6 || diaSeleccionado === 0) {
      // Sábado y Domingo: 9:00 - 14:00
      return (hora > 9 || (hora === 9 && minutos >= 0)) && (hora < 14 || (hora === 14 && minutos === 0));
    } else {
      return false; // Día no válido (por si acaso)
    }
  }
  esCitaDuplicada(): boolean {
    return this.citasReservadas.some(cita => 
      cita.dia === this.registroVo.diaCita && cita.hora === this.registroVo.horaCita
    );
  }
  reservarCita() {
    // Validar que se haya seleccionado fecha y hora
    if (!this.registroVo.diaCita || !this.registroVo.horaCita) {
      alert('Por favor, seleccione una fecha y una hora.');
      return;
    }
    // Validar el horario
    if (!this.validarHorario()) {
      alert('Horario no válido. Seleccione una hora dentro del horario de atención.');
      return; // 🚨 DETIENE la ejecución si el horario es incorrecto
    }
  
    // Validar si la cita ya está reservada
    if (this.esCitaDuplicada()) {
      alert('Esta cita ya está reservada. Elija otra hora.');
      return; // 🚨 DETIENE la ejecución si la cita ya existe
    }
  
    // ✅ Solo si todo es válido, guarda la cita
    this.citasReservadas.push({
      dia: this.registroVo.diaCita,
      hora: this.registroVo.horaCita
    });
  
    alert('Cita reservada con éxito.');
  
    // Reiniciar los campos después de la reserva
    this.registroVo.diaCita = '';
    this.registroVo.horaCita = '';
  }
  
}