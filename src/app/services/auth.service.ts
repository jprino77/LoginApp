import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { UsuarioModel } from "../models/usuario.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private apiKey = "AIzaSyAWgKfGhBsxGR7Rq8yPtkBFn2afPD_RDfI";

  userToken: string;
  // crear nuevo uss
  //  https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.leerToken();
  }
  logout() {
    localStorage.removeItem("token");
  }

  login(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };
    /* pipe funciona de la misma forma que en la vista sirve para aplicar cambios a la data de respuesta*/
    return this.http
      .post(`${this.url}signInWithPassword?key=${this.apiKey}`, authData)
      .pipe(
        /* map solo se ejecuta si la peticion tiene exito, si quuiero cachear error lo puedo hacer con catchError */
        map(resp => {
          this.guardarToken(resp["idToken"]);
          /* El map siempre tiene que retornar algo */
          return map;
        })
      );
  }

  registrar(usuario: UsuarioModel) {
    // const authData = {
    //   email: usuario.email,
    //   password: usuario.password,
    //   returnSecureToken: true
    // };

    // es otra forma de escribir los anterior ... (spret)
    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http
      .post(`${this.url}signUp?key=${this.apiKey}`, authData)
      .pipe(
        /* map solo se ejecuta si la peticion tiene exito, si quuiero cachear error lo puedo hacer con catchError */
        map(resp => {
          this.guardarToken(resp["idToken"]);
          /* El map siempre tiene que retornar algo */
          return map;
        })
      );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;

    localStorage.setItem("token", idToken);

    let hoy = new Date();

    hoy.setSeconds(3600);

    localStorage.setItem("expira", hoy.getTime.toString());
  }

  leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }

    return this.userToken;
  }

  isLogged(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }
    const expira = Number(localStorage.getItem("expira"));

    const expiraDate = new Date();

    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
