import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';  // Asegúrate de importar el módulo HTT
import { TablaComponent } from './tabla/tabla.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,  HttpClientModule, ],//TablaComponent],  // Incluye HttpClientModule aquí
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Corrige `styleUrl` a `styleUrls`
})
export class AppComponent {
  title = 'SaludAunClik';
}
