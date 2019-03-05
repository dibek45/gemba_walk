import { Component } from '@angular/core';


@Component({
  selector: 'informacion-evento',
  template: `<div>
  <ion-card-content>
  <h6>Instrucciones:</h6>
  <ul>
      <p>Boton agregar <ion-icon  color="dark" name="add-circle"></ion-icon> </p><li><span>Agrega un evento para capturar hallazgos con sus respectivas imagenes</span> 
      </li> <li><span>Selecciona evento y crea hallazgos</span></li>
</ul>
</ion-card-content>
</div>`

})
export class Informacion_evento {

  text: string;
  button:string;
  icon_button:string;
  instrucciones_button:string;

  constructor() {
    console.log('Hello InformacionEventoComponent Component');
    this.text = 'Hello World';
    this.button="Boton agregar";
    this.icon_button="add-circle";
    this.instrucciones_button="Agrega un evento para capturar hallazgos con sus respectivas imagenes.";
  }

}
