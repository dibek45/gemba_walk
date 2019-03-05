import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SQLite ,SQLiteObject} from '@ionic-native/sqlite';

@Component({
  selector: 'info-evento',
  templateUrl: 'info-evento.html'
})
export class InfoEventoComponent {

  @Output() there_event = new EventEmitter<boolean>();
  @Input() numero_hallazgos:number;
 
  count_hallazgos:number;

  constructor(private sqlite: SQLite) {
   
  }

  ngAfterContentInit() {
 

  }

  num_eventos(idEvento:number){
    
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS nuevo_hallazgo(hallazgoID INTEGER PRIMARY KEY, fecha TEXT, tipo_eventoID INTEGER, areaID INTEGER,tipo_hallazgoID TEXT,tipo_implementacionID INTEGER,descripcion TEXT,idEvento INTEGER, FOREIGN KEY(idEvento) REFERENCES Eventos92 (idEvento)) ', [])
        .then(res => console.log('checa si tabla existe 28')).catch(e => console.log(JSON.stringify(e)));
        db.executeSql('SELECT COUNT(*) number  FROM nuevo_hallazgo  WHERE idEvento=?',[])
        .then(res => {
         console.log("numero eventos"+res.rows.item(0).number); 
         this.count_hallazgos=res.rows.item(0).number;
         this.there_event.emit(true);
         this.lanzar_output();
        }).catch(e => console.log(JSON.stringify(e)));
       
      }).catch(e => console.log(JSON.stringify(e)));
    

    } 
    lanzar_output():void{
      this.there_event.emit(true);

    }
}
