import { Component,Input } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';



@Component({
  selector: 'titulo-list-event',
  templateUrl: 'titulo-list-event.html'
})
export class TituloListEventComponent {
@Input() idEvento:Number;
titulo_evento:string="Abierto:Completar evento";
area:string;
 

  constructor(private sqlite: SQLite,) {
   
    
  }
  ngAfterContentInit() {
    if(this.idEvento!=0){
      this.getData();
      
    }
  }

  getData() {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS Eventos92(idEvento INTEGER PRIMARY KEY, fecha TEXT, tipo_eventoID INTEGER,tipo_evento TEXT,area TEXT, areaID INTEGER,subarea TEXT, subareaID INTEGER,whoID INTEGER)', [])
      .then(res => console.log('traer lista de Eventos'))
      .catch(e => console.log(JSON.stringify(e)));
      db.executeSql('SELECT e.idEvento, e.tipo_evento, IFNULL( h.hallazgos,0) hallazgos,h.imagenes FROM Eventos92 e LEFT JOIN( SELECT h.idEvento, COUNT(*) hallazgos, SUM(i.imagenes) imagenes FROM nuevo_hallazgo  h LEFT JOIN (  SELECT hallazgoID, COUNT(*) imagenes FROM imagenes_table  GROUP BY hallazgoID) i ON i.hallazgoID = h.hallazgoID GROUP BY h.idEvento) h ON h.idEvento = e.idEvento WHERE e.idEvento=? ',[this.idEvento])
      .then(res => {
        if(res.rows.item(0).tipo_evento==""){
          this.titulo_evento="Abierto:Completar evento";
        }else
        this.titulo_evento=res.rows.item(0).tipo_evento;
        
      }).catch(e => console.log(JSON.stringify(e)));
     
    }).catch(e => console.log(JSON.stringify(e)));
    
  } 

  

}
