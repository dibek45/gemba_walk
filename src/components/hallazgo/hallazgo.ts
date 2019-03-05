import { Component,Input } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { AddDataPage } from '../../pages/add-data/add-data';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { NavController, ActionSheetController, Platform, AlertController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import {GembaServiceProvider} from '../../providers/gemba-service/gemba-service'
import { Network } from '@ionic-native/network';
import { PhotoViewer, PhotoViewerOptions } from '@ionic-native/photo-viewer';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'hallazgo',
  templateUrl: 'hallazgo.html'
})
export class HallazgoComponent {
  @Input() id_hallazgo:number;
  image: string = null;
  image_mini: string = null;
  eventos:string[];
  subArea:string[];
  data = { rowid:0, imagen:"",fecha:""};
  imagenes: any = [];
  balance = 0;
  num_imagen:number;

constructor(private storage: Storage,private alertCtrl: AlertController,public platform: Platform,public actionsheetCtrl: ActionSheetController,private _service:GembaServiceProvider, private camera: Camera, private sqlite: SQLite,
public  navCtrl: NavController, private toast: Toast, private photoViewer: PhotoViewer,
   private network: Network) {
  
   //this.photoViewer.show('https://mysite.com/path/to/image.jpg', 'My image title', {share: false});
   this.num_imagen=0;
  
  }
  
  addData() {
    this.navCtrl.push(AddDataPage);
    
  }
  ngOnInit() {
   
  }
  ngAfterViewInit(){
   // alert(this.id_hallazgo);
    this.getData();
    
  }

   takePhoto(sourceType:number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType:sourceType,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.image = `data:image/jpeg;base64,${imageData}`;
      this.saveData(this.image,this.image_mini);
      this.getData();
    }, (err) => {
      // Handle error
    });
  }
  

   getData() {
    
  
     this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS imagenes_table(rowid INTEGER PRIMARY KEY, imagen TEXT,imagen_mini TEXT,  fecha TEXT, hallazgoID INTEGER, FOREIGN KEY(hallazgoID) REFERENCES nuevo_hallazgo (hallazgoID))', [])
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log(JSON.stringify(e)));
      db.executeSql('SELECT * FROM imagenes_table WHERE hallazgoID=? ORDER BY rowid DESC',[this.id_hallazgo])
      .then(res => {
        this.imagenes = [];
        for(var i=0; i<res.rows.length; i++) {
          // alert(res.rows.item(i).rowid);
          let evidencia = res.rows.item(i).imagen;
          this.imagenes.push({
                               rowid:res.rows.item(i).rowid,
                               imagen:evidencia,
                               fecha:res.rows.item(i).fecha
                              })
          console.log("termino");
        }
        this.num_imagen=this.imagenes.length
        if(this.num_imagen>=2){
          alert("Completado: Limite 2 imagenes por hallazgo");
        }
      })
     
    }).catch(e => console.log(JSON.stringify(e)));
  } 
  
  getCurrentData(rowid) {
 
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('SELECT * FROM imagenes_table WHERE rowid=?', [rowid])
        .then(res => {
          if(res.rows.length > 0) {
            this.data.rowid = res.rows.item(0).rowid;
            this.data.imagen =res.rows.item(0).imagen;
            this.image=this.data.imagen;
           
          }
        })
        .catch(e => {
          console.log(JSON.stringify(e));
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(JSON.stringify(e));
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );
    });
  }

  getPicture(){
      let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth:1000,
      targetHeight:1000,
      quality: 100,
      saveToPhotoAlbum:true
    }
  
    this.camera.getPicture( options )
      .then(imageData => {
            this.image = `data:image/jpeg;base64,${imageData}`;
            this.saveData(this.image,this.image_mini);
            this.getData();

      })
      .catch(error =>{
        console.error( error );
      });

    
  }


saveData(dataimagen:String,dataimagen_mini:String) {
    let  myDate: String = new Date().toISOString();   
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
    
      db.executeSql('INSERT INTO imagenes_table VALUES(NULL,?,?,?,?)',[dataimagen,dataimagen,myDate,this.id_hallazgo])
        .then(res => {
          console.log(res);
          this.toast.show('Nuevo Evento', '5000', 'center').subscribe(

            toast => {
            }
          );
        })
        .catch(e => {
          console.log(JSON.stringify(e));
          this.toast.show(e, '5000', 'center').subscribe(
            toast => {
              console.log(toast);
            }
          );
        });
    }).catch(e => {
      console.log(JSON.stringify(e));
      this.toast.show(e, '5000', 'center').subscribe(
        toast => {
          console.log(toast);  
        }
      );
    });
}



opciones(id:string) {
    let actionSheet = this.actionsheetCtrl.create({
    title: 'Opciones',
    cssClass: 'action-sheets-basic-page',
    buttons: [
    
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
          this.deleteData(id);
          this.image="";
          this.getData();
         
        }
      }
    ]
  });
  alert.present();
}





deleteData(rowid) {
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('DELETE FROM imagenes_table WHERE rowid=?', [rowid])
    .then(res => {
      console.log(res);
      this.getData();
    })
    .catch(e => console.log(JSON.stringify(e)));
  }).catch(e => console.log(JSON.stringify(e)));

}

 
 





}
