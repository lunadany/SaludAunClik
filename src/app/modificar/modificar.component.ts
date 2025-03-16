import { Component, Input} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registroVo } from '../pojos/registroVo.modelo';
import { ModificarService } from '../modificar.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-modificar',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './modificar.component.html',
  styleUrls: ['./modificar.component.css']  // Corregido a styleUrls
})
export class ModificarComponent {
  @Input() registroVo: registroVo = new registroVo();  // Inicialización correcta
  
  constructor(private ModificarService: ModificarService) {}


  buscarDatosCorreo(correo: string): void {
    console.log('Buscando datos para:', correo);
  }

  onMotivoChange(event: Event): void {
    const motivo = this.motivos.find((m) => m.value === this.selectedMotivo);
    this.duracion = motivo ? motivo.tiempo : null;
  }
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
    obtenerDatosCorreo(): void {
      this.ModificarService.obtenerDatosCorreo(this.registroVo.correo).subscribe(
        (data: { correo: string; apellidoPaterno: string; apellidoMaterno: string; nombre: string; telefono: string; alergias: string, sexo: string, motivoConsulta: string, diaCita: string, horaCita: string}) => {
          this.registroVo.correo = data.correo;
          this.registroVo.apellidoPaterno = data.apellidoPaterno;
          this.registroVo.apellidoMaterno = data.apellidoMaterno;
          this.registroVo.nombre = data.nombre;
          this.registroVo.telefono = data.telefono;
          this.registroVo.alergias = data.alergias;
          this.registroVo.sexo = data.sexo;
          this.registroVo.motivoConsulta = data.motivoConsulta;
          this.registroVo.diaCita = data.diaCita;
          this.registroVo.horaCita = data.horaCita;
        }
      );
    }
   // Método para eliminar los datos del registro
   eliminarDatosModificar() {
    if (!this.registroVo.correo) { // Corregido: Se verifica si el correo no está definido
      Swal.fire('Falta información', 'El correo es necesario para eliminar un registro.', 'info');
      console.error('Error: No se ha proporcionado ningún correo.');
      return;
    }
    Swal.fire({
      title: "¿Estás seguro(a) de eliminar el registro?",
      text: `El correo "${this.registroVo.correo}" será eliminado permanentemente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) { // Asegúrate de comprobar si el usuario ha confirmado
        this.ModificarService.eliminarDatosModificar(this.registroVo.correo).subscribe(
          (response: any) => {
            Swal.fire('¡Eliminado!', `El registro "${this.registroVo.correo}" ha sido eliminado correctamente.`, 'success');
            this.resetForm(); // Limpia el formulario si es necesario
          },
          (error: any) => {
            console.error('Error al eliminar los datos:', error);
            Swal.fire('Error', 'No se pudo eliminar el correo. Por favor, intenta más tarde.', 'error');
          }
        );
      }
    });
  } 
  modificarDatosPaciente() {
    // Validar el correo antes de proceder con la modificación
    if (!this.validarCorreo(this.registroVo.correo)) {
      return; // Si el correo es inválido, no proceder
    }
    // Codificar el correo antes de enviarlo a la URL
    const encodedCorreo = encodeURIComponent(this.registroVo.correo);
    // Llamar al servicio para modificar los datos del paciente
    this.ModificarService.modificarDatosPaciente(this.registroVo, encodedCorreo).subscribe(
      (response: any) => {
        console.log('Datos modificados correctamente del ts:', response);
        Swal.fire({
          title: 'Éxito',
          text: 'Datos modificados correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        this.resetForm();
      },
      (error: any) => {
        console.error('Error al modificar los datos del ts:', error);
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al modificar los datos.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    );
  }
  correoInvalido: boolean = false; // Variable para controlar el mensaje
  validarCorreo(correo: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    
    if (!emailPattern.test(correo)) {
      Swal.fire({
        title: 'Correo inválido',
        text: 'Por favor, ingresa un correo válido.',
        icon: 'error',
        confirmButtonText: 'Entendido'
      });
      this.registroVo.correo = ''; // Opcional: limpiar el campo si el correo no es válido
      return false; // Correo inválido
    }
    return true; // Correo válido
  }
  

    private resetForm() {
      this.registroVo = new registroVo();
    }
  }
  

 
