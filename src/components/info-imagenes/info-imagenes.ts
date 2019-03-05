import { Component, Input} from '@angular/core';
import { SQLite ,SQLiteObject} from '@ionic-native/sqlite';


@Component({
  selector: 'info-imagenes',
  templateUrl: 'info-imagenes.html'
})
export class InfoimagenesComponent {

  @Input() id:number;
  count_images:number;

  constructor(private sqlite: SQLite) {

  }
  ngAfterContentInit() {
    this.num_imagen(this.id);
  }

  num_imagen(id):number {

      let number:number;
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('SELECT COUNT(*) as number FROM imagenes_table WHERE hallazgoID=? ',[id])
        .then(res => {
          if(res.rows.length > 0) {
           this.count_images=res.rows.item(0).number;                              
          }
        })
       
      }).catch(e => console.log(JSON.stringify(e)));
      return number;
    
    } 
}
