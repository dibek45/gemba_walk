import { Component, Input } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { NavController, AlertController } from 'ionic-angular';
import { hallazgo } from '../../pages/hallazgoPage/hallazgoPage';
import { GembaServiceProvider } from '../../providers/gemba-service/gemba-service';
import { Storage } from '@ionic/storage';
import { ModalController } from 'ionic-angular';
import { ModalEditarhPage } from '../../pages/modal-editarh/modal-editarh';

@Component({
  selector: 'list-eventos',
  templateUrl: 'list-eventos.html'
})
export class ListEventosComponent {
  numero:number;
  total:number;
  whoID:number;
  eventos:any[];
  image_mini:string;
  hallazgos_de_evento:any[];
  imagenes:any[];
  for_hallazgo_id:number=10;
  loading:boolean;
  my_array:any[];
  subur_bandera:boolean;
  no_eventos:boolean

constructor(public modalCtrl: ModalController,private storage: Storage, public _service:GembaServiceProvider,private sqlite: SQLite,public navCtrl: NavController,private alertCtrl: AlertController) {

  this.storage.get('who').then((val) => {
    console.log('Who:'+ val);
    this.whoID=val;
    this.getData();
  });
  this.storage.get('where').then((val) => {
    console.log('Where:'+ val);
  });
    
  }

  ngAfterContentInit() {
 this.storage.get('who').then((val) => {
  console.log('Who:'+ val);
  
  this.whoID=val;
  this.getData();
});
this.storage.get('where').then((val) => {
  console.log('Where:'+ val);
});

   }
   modal_editar() {
   const modal = this.modalCtrl.create( ModalEditarhPage);
   modal.present();
  }

  getData(){
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS Eventos92(idEvento INTEGER PRIMARY KEY, fecha TEXT, tipo_eventoID INTEGER,tipo_evento TEXT,area TEXT, areaID INTEGER,subarea TEXT, subareaID INTEGER, whoID INTEGER)', [])
      .then(res => console.log('traer lista de Eventos'))
      .catch(e => console.log('1'+JSON.stringify('21'+e)));
      db.executeSql('CREATE TABLE IF NOT EXISTS nuevo_hallazgo(hallazgoID INTEGER PRIMARY KEY, fecha TEXT, tipo_eventoID INTEGER, areaID INTEGER,tipo_hallazgoID TEXT,tipo_implementacionID INTEGER,descripcion TEXT,idEvento INTEGER, FOREIGN KEY(idEvento) REFERENCES Eventos92 (idEvento))', [])
    .then(res => console.log('BIEN')).catch(e => console.log('22'+JSON.stringify(e)));
      db.executeSql('CREATE TABLE IF NOT EXISTS imagenes_table(rowid INTEGER PRIMARY KEY, imagen TEXT,imagen_mini TEXT,  fecha TEXT, hallazgoID INTEGER, FOREIGN KEY(hallazgoID) REFERENCES nuevo_hallazgo (hallazgoID))', [])
      .then(res => console.log('crear tabla'))
      .catch(e => console.log(JSON.stringify('23'+e)));
      db.executeSql('SELECT e.idEvento, e.tipo_evento,e.tipo_eventoID, IFNULL( h.hallazgos,0) hallazgos,e.fecha,e.areaID,h.imagenes FROM Eventos92 e LEFT JOIN( SELECT h.idEvento, COUNT(*) hallazgos, SUM(i.imagenes) imagenes FROM nuevo_hallazgo  h  JOIN (  SELECT hallazgoID, COUNT(*) imagenes FROM imagenes_table  GROUP BY hallazgoID) i ON i.hallazgoID = h.hallazgoID GROUP BY h.idEvento) h ON h.idEvento = e.idEvento WHERE whoID=?',[this.whoID])
      .then(res => {
        this.eventos = [];
        if(res.rows.length<1){
          this.no_eventos=true;
        }else{
          this.no_eventos=false;
        }
        for(var i=0; i<res.rows.length; i++) {
          this.eventos.push({
                               idEvento:res.rows.item(i).idEvento,
                               fecha:res.rows.item(i).fecha,
                               tipo_eventoID:res.rows.item(i).tipo_eventoID,                             
                               areaID:res.rows.item(i).areaID,
                               numero_hallazgos:res.rows.item(i).hallazgos,
                               imagenes:res.rows.item(i).imagenes
                              })
                              console.log(JSON.stringify('es este 4'+JSON.stringify(res.rows.item(i))));

        }
     
      }).catch(e => console.log(JSON.stringify('5'+e)));
   
    }).catch(e => console.log(JSON.stringify('6'+e)));
  } 
  obtener_evento(id:string){

this.navCtrl.setRoot(hallazgo,{item:id,who:this.whoID});
  }


  lanzar_output(){
    console.log("entra a la ap"+event);

  }


  confirmacion_eliminar(id:string) {
 
    let alert = this.alertCtrl.create({
      title: 'Seguro?',
      message: 'Quieres eliminar el evento?',
      buttons: [
        
        {
          text: 'Eliminar',
          role: 'destructive',
          cssClass: "class_used_to_set_icon",
          handler: () => {
            this.deleteData(id);
            this.getData();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
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
      db.executeSql('DELETE FROM Eventos92 WHERE idEvento=?', [rowid])
      .then(res => {
        this.delete_imagenes_evento(rowid);
     this.delete_evento_enviado_hallazgo(rowid);
      })
      .catch(e => console.log(JSON.stringify('7'+e)));
    }).catch(e => console.log(JSON.stringify('8'+e)));
  }

  delete_evento_enviado_imagen(rowid:number) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM imagenes_table  WHERE hallazgoID=?', [rowid])
      .then(res => {
     console.log("borrado imagen");
     this.getData();
      })
      .catch(e => console.log(JSON.stringify('8'+e)));
    }).catch(e => console.log(JSON.stringify('9'+e)));
  }
 

  delete_evento_enviado_hallazgo(id_evento) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM nuevo_hallazgo WHERE idEvento=?', [id_evento])
      .then(res => {
       
      })
      .catch(e => console.log(JSON.stringify('10'+e)));
    }).catch(e => console.log(JSON.stringify('11'+e)));
  }

  delete_evento_enviado_evento(id_evento) {
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('DELETE FROM Eventos92  WHERE idEvento=?', [id_evento])
      .then(res => {
     console.log("borrado evento");
      })
      .catch(e => console.log(JSON.stringify('12'+e)));
    }).catch(e => console.log(JSON.stringify('13'+e)));
  }

  alert(mensaje:string){
    this.loading=true;
    let alert = this.alertCtrl.create({
    title: 'Error de conexion',
    subTitle: mensaje,
    buttons: ['Cerrar']
  });
  alert.present();


}
alert_editable(mensaje:string, titulo:string){
  this.loading=true;
  let alert = this.alertCtrl.create({
  title: titulo,
  subTitle: mensaje,
  buttons: ['OK']
});
alert.present();


}

  presentConfirm_subir(res:any,id:number) {
   
    let alert = this.alertCtrl.create({
      title: 'Confirmacion subir hallazgos de evento',
      message: 'Se subiran '+res.rows.length+' hallazgos del evento',
      cssClass: 'alertCustomCss',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this.loading=false;
         
          }
        },
        {
          text: 'Subir',
          handler: () => {
            
            this.async_enviar(res,id);       
            }   
          }
        
      ]
    });
    alert.present();
  }
  presentConfirm_subir_hallazgo() {
   
    let alert = this.alertCtrl.create({
      title: 'Subir hallazgo',
      message: 'Se subira hallazgo',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Click cancelar');
         
          }
        },
        {
          text: 'Subir',
          handler: () => {
            
                
            }   
          }
        
      ]
    });
    alert.present();
  }

async async_enviar(res,id){
  console.log("RENGLONES",res.rows.length);
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  
    for(var i=0; i<res.rows.length; i++) { 
          let row = res.rows.item(i);
          this.loading=true;
            let numero_hallazgo=row.hallazgoID;
            console.log("es:"+row.descripcion+"mas:"+row.subareaID,JSON.stringify(row));
            try {
              if (i>0) {                
              await await delay(1000);
              }
              await await delay(3000);
              await this.presentConfirm_hallazgo(row,id,numero_hallazgo,res.rows.length,i+1);               
            } catch(e) {
              console.log(e); // 30
            }  
           
    };
 }

 

  traer_hallazgos_de_eventos(id:number) {
    
    
      this.hallazgos_de_evento = [];
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS nuevo_hallazgo(hallazgoID INTEGER PRIMARY KEY, fecha TEXT, tipo_eventoID INTEGER, areaID INTEGER,tipo_hallazgoID TEXT,tipo_implementacionID INTEGER,descripcion TEXT,idEvento INTEGER, FOREIGN KEY(idEvento) REFERENCES Eventos92 (idEvento))', [])
        .then(res => console.log('BIEN')).catch(e => console.log(JSON.stringify('14'+e)));
        db.executeSql(' SELECT  h.hallazgoID, h.idEvento, e.subareaID, e.area,  e.areaID, h.tipo_hallazgoID,h.tipo_implementacionID,h.descripcion, e.idEvento,h.fecha, e.tipo_evento,e.tipo_eventoID FROM nuevo_hallazgo  h  JOIN (  SELECT hallazgoID, COUNT(*) imagenes FROM imagenes_table  GROUP BY hallazgoID) i ON i.hallazgoID = h.hallazgoID JOIN Eventos92 e ON e.idEvento=h.idEvento WHERE e.idEvento=?  GROUP BY h.hallazgoID ',[id])
        .then(res => {
          this.loading=true;
           this.presentConfirm_subir(res,id);
           
      
        }).catch(e => console.log(JSON.stringify('15'+e)));
      
      }).catch(e => console.log(JSON.stringify('16'+e)));
      
  } 

  terminar_evento(item){   
      this.traer_hallazgos_de_eventos(item.idEvento)
   
 }


 insertImagenes(hallazgo_id:number,hallazgo_id_service:number,id:number){


  this.delete_evento_enviado_hallazgo(id);
 this.delete_evento_enviado_evento(id);
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('CREATE TABLE IF NOT EXISTS imagenes_table(rowid INTEGER PRIMARY KEY, imagen TEXT, fecha TEXT, hallazgoID INTEGER, FOREIGN KEY(hallazgoID) REFERENCES nuevo_hallazgo (hallazgoID))', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(JSON.stringify('17'+e)));
        db.executeSql('SELECT * FROM imagenes_table WHERE hallazgoID=? ORDER BY rowid DESC',[hallazgo_id])
        .then(res => {
          this.imagenes = [];

          console.log("numero de imagenes par este hallazgo","id:",hallazgo_id,' ', res.rows.length);
          for(var i=0; i<res.rows.length; i++) {
            this.imagenes.push({rowid:res.rows.item(i).rowid,
                                imagen:res.rows.item(i).imagen,
                                fecha:res.rows.item(i).fecha,
                                hallazgoID:res.rows.item(i).hallazgoID});

                                var base64Img=res.rows.item(i).imagen.substring(23);
                                var promise1= this.b64resize(res.rows.item(i).imagen,200);
                            Promise.all([promise1]).then(async values => { 
                                  let valor=String(values[0]);
                                  //console.log(":243"+valor);
                                  console.log("_____________"+hallazgo_id_service);
                                 await  this.enviar_a_servicio(hallazgo_id_service,base64Img,valor.substring(23),hallazgo_id);
                                  });                         
          }
        })
   
  }).catch(e => console.log(JSON.stringify('18'+e)));
  }
 

 enviar_a_servicio(id,imagen,imagen_mini, id_local:number){


let scope=this;
        this._service.insert_imagen(id,imagen,imagen_mini).subscribe(
        data =>
       scope.delete_evento_enviado_imagen(id_local),
        err => console.log(JSON.stringify('18*'+err))
    ) 
    
 }
  
   
  b64resize(URI,maxSize) {
    
    return new Promise(function(resolve, reject) {
      if (URI == null) return reject();
      var canvas = document.createElement('canvas'),
          context = canvas.getContext('2d'),
          image = new Image();
          image.addEventListener('load', function() {
  
        canvas.width = image.width;
        canvas.height = image.height;
        var canvas2 = document.createElement('canvas');
          var width = image.width;
          var height = image.height;
  
          if (width > height) {
  
              if (width > maxSize) {
                  height *= maxSize / width;
                  width = maxSize;
              }
  
          } else {
              if (height > maxSize) {
                  width *= maxSize / height;
                  height = maxSize;
              }
  
          }
  
          canvas2.width = width;
          canvas2.height = height;
  
          canvas2.getContext('2d').drawImage(image, 0, 0, width, height);
          var dataUrl = canvas2.toDataURL('image/jpeg');
          resolve(dataUrl)
  
   
  
      }, false);
  
   
  
      image.src = URI;
  
    });
  
  }
  delete_imagenes_evento(idEvento:number) {
    
      this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('DELETE FROM imagenes_table WHERE rowid IN (SELECT i.rowid FROM imagenes_table i JOIN nuevo_hallazgo h ON h.hallazgoID=i.hallazgoID WHERE h.idEvento=?) ', [idEvento])
        .then(res => {
          console.log(res);
          this.getData();
        })
        .catch(e => console.log(JSON.stringify('19'+e)));
      }).catch(e => console.log(JSON.stringify('20'+e)));
    
    
    
    }


    presentConfirm_hallazgo(row,id,numero_hallazgo,total:number,index) {
     this.numero=index;
     this.total=total;
     let alert = this.alertCtrl.create({
      title: 'Subir hallazgo: <h1>'+this.numero+' de '+total+'<h1>',
      message: 'No cierre la aplicacion, presione continuar en cada hallazgo ',
      cssClass: 'alertCustomCss',
      buttons: [
          {
            text: 'Subir',
            cssClass: 'alertCustomCss',
            handler: () => {
              let scope=this;
              this.loading=true;
                this._service.insert_hallazgo(row.tipo_eventoID,row.fecha,row.areaID, row.subareaID,row.tipo_hallazgoID,row.tipo_implementacionID,row.descripcion,this.whoID)
                  
              .subscribe(
                            async (data:{ response: string }) =>{
                            console.log('_*_*_*'+JSON.stringify(data.response));
                            
                            try {  await scope.insertImagenes(numero_hallazgo,parseInt(data.response),id) ,
                            err => scope.alert("Verifique su conexion")} catch(e) {console.log(e); // 30
                            } 
          },
        (err) => {
            scope.alert("Verifique su conexion a internet")
          })
          if (index=total) {
        this.loading=false;
          }    
              }   
            }
          
        ]
      });
      alert.present();
     
    }
}
