import { Component } from '@angular/core';

/**
 * Generated class for the InformacionHallazgoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'informacion-hallazgo',
  template: `<div>
  <ion-card-content>
  <h6>Instrucciones:</h6>
  <ul>
  <li>Boton agregar <ion-icon  color="dark" name="add-circle"></ion-icon> <span>Agrega un nuevo hallazgo, con la informacion necesaria.</span> 
      </li> <li><span>Selecciona un hallazgo existente y captura fotografias como evidencia del mismo.</span></li>
</ul>
</ion-card-content>
</div>`
})
export class InformacionHallazgoComponent {

  text: string;

  constructor() {
  }

}
