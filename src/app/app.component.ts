import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { hallazgo } from '../pages/hallazgoPage/hallazgoPage';
import { LoginPage  } from '../pages/login/login';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { GembaServiceProvider } from '../providers/gemba-service/gemba-service';
import { AppVersion } from '@ionic-native/app-version/ngx';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = LoginPage;
  pages: Array<{title: string, component: any,icon:string}>;
  version:string;

  constructor(
    private appVersion: AppVersion,
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private storage: Storage,
    public _service:GembaServiceProvider
  ) {

    this.initializeApp();                                                                                                                                                                                                                                                                                                                                                                
  }

  initializeApp() {
    this.loading();
    this.platform.ready().then(() => {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  salir() {
    alert("Session terminada");
    this.menu.close();
    this.storage.set('who', null);
    this.nav.setRoot(LoginPage,{});
  }
  openMisEventos() {
    
    this.menu.close();
    this.nav.setRoot(hallazgo,{});
  }

  proxima(){
    alert("PROXIMAMENTE");
  }

  
  loading(){
    console.log("entra");
   this._service.log_in('norberto.aldana','081216')
    .subscribe(
      (data) => { // Success
       console.log(JSON.stringify(data));
      },
      error => {
      console.log(JSON.stringify(error));
      },
      () => {
        console.log("finalizo");
        // 'onCompleted' callback.
        // No errors, route to new page here
      })
    }

 
}
