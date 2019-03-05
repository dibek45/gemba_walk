import { Component,Input} from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import {GembaServiceProvider} from '../../providers/gemba-service/gemba-service'
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { Evento} from '../../Models/evento.model';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import {Storage} from '@ionic/storage'
import { hallazgo } from '../hallazgoPage/hallazgoPage';
import { l } from '@angular/core/src/render3';


@IonicPage()
@Component({
  selector: 'page-add-data',
  templateUrl: 'add-data.html',
})
export class AddDataPage {
  objetoRecibido: any;
  areaID:string;
  image: string = null;
  tipo_eventoID:number;
  tipo_evento:string;
  eventos: {};
  areas: any[] = [];
  subAreas: {};
  expenses: any = [];
  data = { imagen:""};
  todo:any = {};
  evento:Evento;
  imagenes: any = [];
  key:string="items";
  whoID:number;
  whereID:number;
  

  constructor(private alertCtrl: AlertController,public platform: Platform, public loadingCtrl: LoadingController, private formBuilder: FormBuilder,private sqlite: SQLite,public navCtrl: NavController, public gembaServiceProvider:GembaServiceProvider,
    public navParams: NavParams,private toast: Toast,private storage:Storage) {
    
      this.todo = this.formBuilder.group({
        tipo_eventoID:['',Validators.required],
        tipo_sub_areaID:['',Validators.required]
      });
      this.objetoRecibido = navParams.data;
   
    }


    loading(text:string) {
      const loader = this.loadingCtrl.create({
        content: text,
        duration: 3000
      });
      loader.present();
    }


    logForm():boolean{
  
      return false;
    }
    ionViewDidLoad() {
     // alert( JSON.stringify(this.objetoRecibido));
     this.loading("Cargando eventos del servidor");
      let lastTimeBackPress = 0;
      let timePeriodToExit = 500;
      this.platform.registerBackButtonAction(() => {
        var activeView = this.navCtrl.getActive(); 
        let scope=this;
        if('AddDataPage'== activeView.name){
         this.navCtrl.setRoot(hallazgo,{item:JSON.stringify(this.objetoRecibido.id),who:JSON.stringify(this.objetoRecibido.whoID)});
        }
      });


      this.storage.get('who').then((val) => {
        console.log('Who:'+ val);
        this.whoID=val;
      });

      this.storage.get('where').then((val) => {
        console.log('Where:'+ val);
        this.whereID=val;
        this.getEventos();
       
      });
    }

    getEventos(){
      this.gembaServiceProvider.getEventos(this.whoID,this.whereID)
      .subscribe(
        (data) => { // Success
          this.eventos =data;   
          console.log("Eventos",JSON.stringify(this.eventos));
        },
        onerror=>{this.loading("Cargando..");
          alert( "Error ")}
      )
    }

  alert(mensaje:string){
      let alert = this.alertCtrl.create({
        title: 'Error de conexion',
        subTitle: mensaje,
        buttons: ['Cerrar']
      });
      alert.present();
  }
   

    get_evento(obj:any){
      console.log("---------------------------------------------------stuut"+JSON.stringify(obj));
      this.loading("Cargando  subareas");
      this.tipo_eventoID=obj.eventoID;
      this.gembaServiceProvider.getSubArea(obj.eventoID)
      .subscribe(
          (data) => {
            this.subAreas = data;
            console.log(JSON.stringify(data));
          },
          (error) =>{
            console.error(JSON.stringify(error));
          }
      )
    }

guardar_sub_area(obj:any){
      console.log("essssssssssssssssssss"+JSON.stringify(obj));
      this.areaID=this.todo.value.tipo_sub_areaID;   
}


enviar(){
  this.terminar_datos_evento();
 // this.loading("Guardando");
}
    
guardar_evento_storage(eventoID){
  this.storage.set('evento_storage',eventoID );
}

terminar_datos_evento(){

       let  myDate: String = new Date().toISOString();
       this.sqlite.create({
        name: 'ionicdb.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
      console.log(JSON.stringify(this.areaID)+this.todo.value.tipo_sub_areaID)
       alert(this.tipo_eventoID);
        db.executeSql('UPDATE nuevo_hallazgo SET areaID=?,idEvento=?',
        [ 
          this.areaID,
          this.tipo_eventoID])
          .then(res => { 
            console.log("",JSON.stringify(res));
            this.toast.show('Evento Guardado', '5000', 'center').subscribe(
              toast => {
                this.guardar_evento_storage(this.tipo_eventoID);
                this.navCtrl.setRoot(hallazgo);
              }
            );
          })
          .catch(e => {
            console.log(JSON.stringify(e));
            this.toast.show(e, '5000', 'center').subscribe(
              toast => {
               console.log(JSON.stringify(toast));
              }
            );
          });
      }).catch(e => {
        console.log(JSON.stringify(e));
        this.toast.show(e, '5000', 'center').subscribe(
          toast => {
            console.log(JSON.stringify(toast));
          }
        );
      });
     }    
}

