import { Component,Output,EventEmitter, Input } from '@angular/core';
import {Storage} from '@ionic/storage'
import { SQLite ,SQLiteObject} from '@ionic-native/sqlite';
import { AlertController, ActionSheetController, ModalController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { ModalEditarhPage } from '../../pages/modal-editarh/modal-editarh';


@Component({
  selector: 'list-hallazgos',
  templateUrl: 'list-hallazgos.html'
})
export class ListHallazgosComponent {
  @Output() id_elemento = new EventEmitter<number>();
  @Output() id_elemento_opcion = new EventEmitter<number>();
  @Input() newElement:boolean;
  @Input() id_evento:number;
  text: string;
  key:string="items";
  datos: Object[];
  imagenes: Object[];
  hallazgos:any[];
  llamada: Object[];
  numero_imagenes:any[];
  ids:number[];
  

  constructor(public navParams: NavParams,public modalCtrl: ModalController, public actionsheetCtrl: ActionSheetController,public platform: Platform,private storage:Storage,private sqlite: SQLite,private alertCtrl: AlertController,public actionSheetCtrl: ActionSheetController) {
  
    
  
  }

  ngAfterContentInit() {
    //aqui error
    
    this.getData();
   }
  
get_hallazgos():void{
  this.storage.get(this.key).then((val)=>{
    if(val!=null&&val!=undefined){
      //console.log(JSON.stringify([JSON.parse(val) ]));
      
     this.datos=JSON.parse(val);
     this.imagenes =this.datos[0]["imagenes"];
     console.log(JSON.stringify(this.datos[0]));
    }
  });
}

async getData() {
  
let id:number;

   await this.storage.get('evento_storage').then((val) => {
    if(val!=null)
    id=val;
    alert(id);
  });
  await this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
     db.executeSql('CREATE TABLE IF NOT EXISTS imagenes_table(rowid INTEGER PRIMARY KEY, imagen TEXT,imagen_mini TEXT,  fecha TEXT, hallazgoID INTEGER, FOREIGN KEY(hallazgoID) REFERENCES nuevo_hallazgo (hallazgoID))', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(JSON.stringify(e)));
    db.executeSql('CREATE TABLE IF NOT EXISTS nuevo_hallazgo(hallazgoID INTEGER PRIMARY KEY, fecha TEXT, tipo_eventoID INTEGER, areaID INTEGER,tipo_hallazgoID TEXT,tipo_implementacionID INTEGER,descripcion TEXT,idEvento INTEGER, FOREIGN KEY(idEvento) REFERENCES Eventos92 (idEvento))', [])
    .then(res => console.log('BIEN')).catch(e => console.log(JSON.stringify(e)));
    db.executeSql('SELECT h.hallazgoID,tipo_eventoID,h.fecha,areaID,tipo_hallazgoID,descripcion,tipo_implementacionID,i.imagen FROM nuevo_hallazgo h LEFT JOIN imagenes_table i ON i.hallazgoID=h.hallazgoID WHERE h.idEvento=? ORDER BY h.hallazgoID ASC  ',[id])
    .then(res => {
      this.hallazgos = [];
      for(var i=0; i<res.rows.length; i++) {
       
        this.hallazgos.push({         
                             rowid:res.rows.item(i).hallazgoID,
                             tipo_eventoID:res.rows.item(i).tipo_eventoID,
                             fecha:res.rows.item(i).fecha, 
                             areaID:res.rows.item(i).areaID,
                             tipo_hallazgoID:res.rows.item(i).tipo_hallazgoID,
                             descripcion:res.rows.item(i).descripcion,
                             tipo_implementacionID:res.rows.item(i).tipo_implementacionID,
                             imagen:res.rows.item(i).imagen
                            })
                            
                           
      }
   
    }).catch(e => console.log(JSON.stringify(e)));
   
  }).catch(e => console.log(JSON.stringify(e)));
  
 
} 

obtener_hallazgo(id:string):void{
 // alert(id);
  this.id_elemento.emit(parseInt(id));
  this.getData();
}
/**
  {
      text: 'Subir',
      icon: !this.platform.is('ios') ? 'cloud-upload' : null,
      handler: () => {
      this.fragmentoInfo(id);

      }
    },
 */
presentActionSheet(id:string) {let actionSheet = this.actionsheetCtrl.create({
  title: 'Opciones',
  cssClass: 'action-sheets-basic-page',
  buttons: [
    
    {
      text: 'Editar',

      icon: !this.platform.is('ios') ? 'md-brush' : null,
      handler: () => {
        const modal = this.modalCtrl.create( ModalEditarhPage,{
          id:id,
          eventoID:this.id_evento
        });
        modal.present();
      }
    },
    
    {
      text: 'Delete',
      role: 'destructive',
      icon: !this.platform.is('ios') ? 'trash' : null,
      handler: () => {
      this.confirmacion_eliminar(id);
      }
    },    
    {
      text: 'Cancel',
      role: 'cancel', // will always sort to be on the bottom
      icon: !this.platform.is('ios') ? 'close' : null,
      handler: () => {
        console.log('Cancel clicked');
      }
    }
  ]
});
actionSheet.present();
}
fragmentoInfo(id:string){
  this.id_elemento_opcion.emit(parseInt(id));
}

deleteData(rowid) {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('DELETE FROM nuevo_hallazgo WHERE hallazgoID=?', [rowid])
    .then(res => {
      console.log(JSON.stringify(res));
      this.getData();
    })
    .catch(e => console.log(JSON.stringify(e)));
  }).catch(e => console.log(JSON.stringify(e)));
}
deleteData_imagen(rowid) {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('DELETE FROM imagenes_table WHERE hallazgoID=?', [rowid])
    .then(res => {
      console.log(JSON.stringify(res));
     
    })
    .catch(e => console.log(JSON.stringify(e)));
  }).catch(e => console.log(JSON.stringify(e)));
}


confirmacion_eliminar(id:string) {
  let alert = this.alertCtrl.create({
    title: 'Seguro?',
    message: 'Quieres eliminar este hallazgo?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
          

        }
      },
      {
        text: 'Eliminar',
        handler: () => {
          console.log('Buy clicked');
          this.deleteData_imagen(id);
          this.deleteData(id);
          this.getData();
        }
      }
    ]
  });
  alert.present();
}

}
