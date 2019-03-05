import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular'
import { HallazgoComponent } from './hallazgo/hallazgo';
import { ListHallazgosComponent } from './list-hallazgos/list-hallazgos';
import { InfoimagenesComponent } from './info-imagenes/info-imagenes';
import { InfoEventoComponent } from './info-evento/info-evento';
import { ListEventosComponent } from './list-eventos/list-eventos';
import { TituloListEventComponent } from './titulo-list-event/titulo-list-event';





@NgModule({
	declarations: [HallazgoComponent,
    ListHallazgosComponent,
    InfoimagenesComponent,
    InfoEventoComponent,
    ListEventosComponent,
    TituloListEventComponent
  
    ],
	imports: [IonicModule],
	exports: [HallazgoComponent,
    ListHallazgosComponent,
    InfoimagenesComponent,
    InfoEventoComponent,
    ListEventosComponent,
    TituloListEventComponent
   
    
    ]
})

export class ComponentsModule {}
