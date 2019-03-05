import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { hallazgo } from '../pages/hallazgoPage/hallazgoPage';
import {LoginPage  } from '../pages/login/login';
import {ComponentsModule} from '../components/components.module'
import { AddDataPage } from '../pages/add-data/add-data';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { GembaServiceProvider } from '../providers/gemba-service/gemba-service';
import { Network } from '@ionic-native/network';
import { IonicStorageModule } from '@ionic/storage';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ModalEditarhPage } from '../pages/modal-editarh/modal-editarh';
import { AppVersion } from '@ionic-native/app-version/ngx';

import { Informacion_evento} from '../components/informacion-evento/informacion-evento';
import { InformacionHallazgoComponent} from '../components/informacion-hallazgo/informacion-hallazgo';
import { DbProvider } from '../providers/db/db';







@NgModule({
  declarations: [
    MyApp,
    hallazgo,
    AddDataPage,
    LoginPage,
    ModalEditarhPage,
    Informacion_evento,
    InformacionHallazgoComponent
    
  ],
  imports: [
    IonicModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    ComponentsModule,
    IonicStorageModule.forRoot()
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    hallazgo,
    AddDataPage,
    LoginPage,
    ModalEditarhPage,
    Informacion_evento,
    InformacionHallazgoComponent
    
  ],

  providers: [
    AppVersion,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    SQLite,
    Toast,
    GembaServiceProvider,
    Network,
    PhotoViewer,
    IonicImageViewerModule,
    DbProvider
  ]
})
export class AppModule {}
