import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { hallazgo } from '../hallazgoPage/hallazgoPage';
import { GembaServiceProvider } from '../../providers/gemba-service/gemba-service';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    username:string;
    validacion=true;
   
imageObject: Array<object> = [{
     
        thumbImage: 'assets/img/slider/1_min.jpeg'
    }, {
        thumbImage: 'assets/img/slider/2_min.jpeg'
    }, {
        thumbImage: 'assets/img/slider/3_min.jpeg'
    }
];
private form_login : FormGroup;
  constructor(private alertCtrl: AlertController,public loadingCtrl: LoadingController,private storage: Storage, private sqlite: SQLite,public navCtrl: NavController, public navParams: NavParams, public servicio:GembaServiceProvider,private formBuilder: FormBuilder ) {

    this.form_login = this.formBuilder.group({
        usuario: ['', Validators.required],
        password: ['',Validators.required],
      });
  }

  ionViewDidLoad() {
    this.storage.get('who').then((val) => {
        if(val!=null)
        this.navCtrl.setRoot(hallazgo);
      });
  }
 
    loading() {
        let myFirstPromise = new Promise((resolve, reject) => {
            const loader = this.loadingCtrl.create({
                content: "Cargando",
                duration: 2000
              });
              loader.present();
            resolve("Success!"); 
          });

          let scope=this;
          myFirstPromise.then((successMessage) => {
            scope.servicio.log_in(scope.form_login.value.usuario,scope.form_login.value.password).subscribe(
                data =>{
                  console.log(JSON.stringify(data)),
                  err => alert(JSON.stringify(err))
                  if(data){
                    scope.storage.set('who', data[0].usuarioID);
                    scope.storage.set('where', data[0].empresaID);
                    setTimeout(()=>{  
                    scope.navCtrl.setRoot(hallazgo,{});
        
                 }, 500);
                }    
            },
            (err) => {
              scope.alert("Verifique conexion a internet o datos de usuario")
            })    
           
           
          });
  }

  alert(mensaje:string){

    let alert = this.alertCtrl.create({
    title: 'Error de conexion',
    subTitle: mensaje,
    buttons: ['Cerrar']
  });
  alert.present();


}
    logForm():void{
        this.loading();
      }


      
}
