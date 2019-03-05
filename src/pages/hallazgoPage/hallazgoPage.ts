import { Component, ViewChild, Input } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { NavController, LoadingController, NavParams, PopoverController } from 'ionic-angular';
import { Toast } from '@ionic-native/toast';
import {GembaServiceProvider} from '../../providers/gemba-service/gemba-service'
import { Network } from '@ionic-native/network';
import {ListHallazgosComponent} from '../../components/list-hallazgos/list-hallazgos'
import { ApplicationRef } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Navbar } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import {AddDataPage} from '../add-data/add-data'
import { Platform, MenuController, Nav } from 'ionic-angular';
import {InformacionHallazgoComponent  } from '../../components/informacion-hallazgo/informacion-hallazgo';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'mainPage',
  templateUrl: 'hallazgoPage.html'
})
export class hallazgo {
  image: string = null;
  area:any[];
  subArea:string[];
  private parentID:number;
  data = { rowid:0, imagen:"",fecha:""};
  arreglo={tipoID:0,descripcion:"", implementacionID:0};
  imagenes: any = [];
  balance = 0;
  show:string;
  @ViewChild(ListHallazgosComponent) child:ListHallazgosComponent; 
  @ViewChild(Navbar) navBar: Navbar;
  FullScreen:any;
  id_evento:number;
  whoID:number;

   constructor(private storage: Storage,public popoverCtrl: PopoverController, public platform: Platform,public loadingCtrl: LoadingController,private _service:GembaServiceProvider, private camera: Camera, private sqlite: SQLite,
    public  navCtrl: NavController, private toast: Toast, private applicationRef : ApplicationRef ,
    private network: Network, private alertCtrl: AlertController,private photoViewer: PhotoViewer, public navParams: NavParams) {
   
       this.storage.get('evento_storage').then((val) => {
        if(val!=null)
        this.id_evento=val;
      });
    this.whoID=navParams.get('who'); 

    let lastTimeBackPress = 0;
    let timePeriodToExit = 2000;

    platform.registerBackButtonAction(() => {
      var activeView = navCtrl.getActive(); 

      if('mainPage'== activeView.name){
       // this.navCtrl.setRoot(EventosPage);
      }
      
      
    });
    }

    terminar_evento(){
      let paramsParaSegPag = {
        whoID:this.whoID
      };
    
      this.navCtrl.setRoot(AddDataPage,paramsParaSegPag);
    
  }

   ionViewDidLoad() {

    this.show="lista"
    this.navBar.backButtonClick = (e:UIEvent)=>{
     this.show="lista"
    
    }
    
  }

   date():string {
    var x = new Date();
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    (d.length == 1) && (d = '0' + d);
    (m.length == 1) && (m = '0' + m);
    var yyyymmdd = y +'/'+ m +'/'+ d;
    return yyyymmdd;
}

  new_data() {
    const prompt = this.alertCtrl.create({
      title: 'Descripción del hallazgo',
      message: "Problema encontrado",
      inputs: [
        
        {
          name: 'descripcion',
          placeholder: ''
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Guardar',
          handler: data => {
            this.arreglo.descripcion=data.descripcion;
           // this.nuevo_evento(data.descripcion);
           if (data.descripcion!="") {
            
            this.tipo_evento();
          }
            
          }
        }
      ]
    });
    prompt.present();
  }

  tipo_evento(){
    let alert = this.alertCtrl.create({
      title: 'Especificar la razón',
      inputs: [
        {
          type: 'radio',
          label: '1ra Selección',
          value: '1'
        },
        {
          type: 'radio',
          label: '2da Orden',
          value: '2'
        },
        {
          type: 'radio',
          label: '3ra Limpieza',
          value: '3'
        },
        {
          type: 'radio',
          label: 'Mejora',
          value: '4'
        },
        {
          type: 'radio',
          label: 'Reparación',
          value: '5'
        }
        ,
        {
          type: 'radio',
          label: 'Seguridad',
          value: '6'
        },
        {
          type: 'radio',
          label: '4a Estandarización',
          value: '7'
        },
        {
          type: 'radio',
          label: 'Capacitación',
          value: '8'
        },
        {
          type: 'radio',
          label: 'Fuga prioridad alta',
          value: '9'
        },{
          type: 'radio',
          label: 'Fuga prioridad baja',
          value: '10'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: (data:string) => {
            if (data!=null) {
            this.arreglo.tipoID=parseInt(data);
            console.log(this.arreglo.tipoID);
            this.tipo_implementacion();
            }
          }
        }
      ]
    });
    alert.present();
  }


  tipo_implementacion(){

    let alert = this.alertCtrl.create({
      title: 'Tipo implementacion',
      inputs: [
       
        {
          type: 'radio',
          label: 'Acción',
          value: '1'
        },
        {
          type: 'radio',
          label: 'Inversión',
          value: '2'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {


          }
        },
        {
          text: 'OK',
          handler: (data:string) => {
            if (data!=null) {
              this.arreglo.implementacionID=parseInt(data);
              this.nuevo_hallazgo(this.arreglo);
            }
            
         
          }
        }
      ]
    });
    alert.present();
  }
  loading() {
    const loader = this.loadingCtrl.create({
      content: "Please wait...",
      duration: 3000
    });
    loader.present();
  }

   nuevo_hallazgo(arreglo){
    let  myDate: String = new Date().toISOString();
    
    this.sqlite.create({
      name: 'ionicdb.db',
      location: 'default'
    }).then((db: SQLiteObject)  => {
      db.executeSql('INSERT INTO nuevo_hallazgo VALUES(NULL,?,?,?,?,?,?,?)',[myDate,0,0,arreglo.tipoID,arreglo.implementacionID,arreglo.descripcion,this.id_evento])
        .then(res => {
          console.log(res);
          this.child.getData();
          this.applicationRef.tick();
          this.toast.show('Nuevo hallazgo', '5000', 'center').subscribe(
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

  
itemHallasgo(id:number):void{
this.parentID=id;
this.show="hallazgo";

}

  itemHallasgo_opcion(id:number):void{
  alert(id);
  }

  information(myEvent) {
    let popover = this.popoverCtrl.create(InformacionHallazgoComponent);
    popover.present({
      ev: myEvent
    });
  }
}
