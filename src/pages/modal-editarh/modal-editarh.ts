import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import {hallazgo} from '../hallazgoPage/hallazgoPage'
import { Toast } from '@ionic-native/toast';

@IonicPage()
@Component({
  selector: 'page-modal-editarh',
  templateUrl: 'modal-editarh.html',
})
export class ModalEditarhPage {
  public get sqlite(): SQLite {
    return this._sqlite;
  }
  public set sqlite(value: SQLite) {
    this._sqlite = value;
  }

  todo:any = {};
  eventoID:number;
  id:number;
  hallazgos:any=[];

  constructor(private toast: Toast,private _sqlite: SQLite,private formBuilder: FormBuilder,public navCtrl: NavController, public navParams: NavParams) {
    this.todo = this.formBuilder.group({
      descripcion:['',Validators.required],
      razon:['',Validators.required],
      implementacion:['',Validators.required]
    });
   this.eventoID=this.navParams.get('eventoID');
   this.id=this.navParams.get('id');
  
   this.getData(this.id);
  }
 
  ionViewDidLoad() {
  
  }
closeModal(){
  this.navCtrl.setRoot(hallazgo,{item:this.eventoID});
}

getData(id:number) {


  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
    db.executeSql('CREATE TABLE IF NOT EXISTS nuevo_hallazgo(hallazgoID INTEGER PRIMARY KEY, fecha TEXT, tipo_eventoID INTEGER, areaID INTEGER,tipo_hallazgoID TEXT,tipo_implementacionID INTEGER,descripcion TEXT,idEvento INTEGER, FOREIGN KEY(idEvento) REFERENCES Eventos92 (idEvento))', [])
    .then(res => console.log('BIEN')).catch(e => console.log(JSON.stringify(e)));
    db.executeSql('SELECT * FROM nuevo_hallazgo WHERE hallazgoID=? ORDER BY hallazgoID ASC  ',[id])
    .then(res => {
      this.hallazgos = [];
     
      for(var i=0; i<res.rows.length; i++) {
        this.todo.controls['descripcion'].setValue(res.rows.item(i).descripcion);
        this.todo.controls['razon'].setValue(res.rows.item(i).tipo_hallazgoID);
        this.todo.controls['implementacion'].setValue(res.rows.item(i).tipo_implementacionID);        
      }
    }).catch(e => console.log(JSON.stringify(e)));
  }).catch(e => console.log(JSON.stringify(e)));

} 

update():void{
  let  myDate: String = new Date().toISOString();
      
  this.sqlite.create({
    name: 'ionicdb.db',
    location: 'default'
  }).then((db: SQLiteObject) => {
  
   
    db.executeSql('UPDATE nuevo_hallazgo SET descripcion=?,tipo_hallazgoID=?, tipo_implementacionID=? WHERE hallazgoID=?',
    [ this.todo.value.descripcion,
      this.todo.value.razon,
      this.todo.value.implementacion,
      this.id])
      .then(res => { 
        console.log("",JSON.stringify(res));
        this.toast.show('Hallazgo actualizado', '5000', 'center').subscribe(
          toast => {
            this.navCtrl.setRoot(hallazgo,{item:this.eventoID});
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
