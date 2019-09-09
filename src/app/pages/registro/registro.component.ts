import { Component, OnInit } from '@angular/core';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  recordame = false;
  usuario: UsuarioModel;

  constructor(private auth: AuthService, private route: Router) {}

  ngOnInit() {
    this.usuario = new UsuarioModel();
  }

  onSubmit(registroForm: NgForm) {
    if (registroForm.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor ...'
    });

    Swal.showLoading();

    this.auth.registrar(this.usuario).subscribe(
      resp => {
        Swal.close();
        if (this.recordame) {
          localStorage.setItem('email', this.usuario.email);
        }
        this.route.navigateByUrl('/home');
        console.log(resp);
      },
      err => {
        console.log(err.error.error.message);

        Swal.fire({
          type: 'error',
          title: 'Error al autentificar',
          text: err.error.error.message
        });
      }
    );
  }
}
