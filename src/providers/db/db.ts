import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


@Injectable()
export class DbProvider {

  constructor(public sqlite: SQLite, public http: HttpClient) {
    
  }


  public getHallazgos(id:number) {

      return new Promise((resolve, reject) => {
          this.sqlite.create({
            name: 'ionicdb.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('CREATE TABLE IF NOT EXISTS imagenes_table(rowid INTEGER PRIMARY KEY, imagen TEXT,imagen_mini TEXT,  fecha TEXT, hallazgoID INTEGER, FOREIGN KEY(hallazgoID) REFERENCES nuevo_hallazgo (hallazgoID))', [])
          .then(res => console.log('Executed SQL'))
          .catch(e => console.log(JSON.stringify(e)));
          db.executeSql('CREATE TABLE IF NOT EXISTS nuevo_hallazgo(hallazgoID INTEGER PRIMARY KEY, fecha TEXT, tipo_eventoID INTEGER, areaID INTEGER,tipo_hallazgoID TEXT,tipo_implementacionID INTEGER,descripcion TEXT,idEvento INTEGER, FOREIGN KEY(idEvento) REFERENCES Eventos92 (idEvento))', [])
          .then(res => console.log('BIEN')).catch(e => console.log(JSON.stringify(e)));
          db.executeSql('SELECT * FROM nuevo_hallazgo WHERE idEvento=? ORDER BY hallazgoID ASC  ',[id])
          .then(res => {
            let hallazgos = [];
          
            for(var i=0; i<res.rows.length; i++) {   
                  hallazgos.push({         
                                      rowid:res.rows.item(i).hallazgoID,
                                      tipo_eventoID:res.rows.item(i).tipo_eventoID,
                                      fecha:res.rows.item(i).fecha, 
                                      areaID:res.rows.item(i).areaID,
                                      tipo_hallazgoID:res.rows.item(i).tipo_hallazgoID,
                                      descripcion:res.rows.item(i).descripcion,
                                      tipo_implementacionID:res.rows.item(i).tipo_implementacionID
                                      })
                                    console.log(JSON.stringify(hallazgos)); 
                }
            resolve(hallazgos);
          }, (error) => {
              reject(error);
          }).catch(e => console.log(JSON.stringify(e)))
      }).catch(e => console.log(JSON.stringify(e)));
    }
  )};
}
