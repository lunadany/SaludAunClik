import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida.component';
import { RegistroComponent } from './registro/registro.component';
import { TablaComponent } from './tabla/tabla.component';
import { ModificarComponent } from './modificar/modificar.component';
import { LoginComponent } from './login/login.component';
import { FechasComponent } from './fechas/fechas.component';


export const routes: Routes = [
    {path: '', pathMatch: 'full', redirectTo: '/bienvenida'},
    {path: 'bienvenida', component: BienvenidaComponent},
    {path: 'registro', component: RegistroComponent},
    {path: 'tabla', component: TablaComponent},
    {path: 'modificar', component: ModificarComponent},
    {path: 'login', component: LoginComponent},
    {path: 'fechas', component: FechasComponent},
    {path: '**', component: BienvenidaComponent}
];

