import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: UsuarioModel;
  recordame = false;

  constructor(private auth: AuthService, private route: Router) {}

  ngOnInit() {
    this.usuario = new UsuarioModel();

    if(localStorage.getItem('email')){
      this.usuario.email = localStorage.getItem('email');
      this.recordame = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor ...'
    });

    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(
      resp => {
        Swal.close();
        console.log(resp);

        if (this.recordame) {
          localStorage.setItem('email', this.usuario.email);
        }
        this.route.navigateByUrl('/home');
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
    console.log('valido');
  }
}
