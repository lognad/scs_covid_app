import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP} from '@ionic-native/http/ngx';
import {HttpClientModule} from '@angular/common/http';
import {HttpClientService} from './services/http/http-client.service';
import {Vibration} from '@ionic-native/vibration/ngx';
// import {BackgroundGeolocation} from '@ionic-native/background-geolocation/ngx';

// import {FCM} from '@ionic-native/fcm';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
    providers: [
        StatusBar,
        SplashScreen,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        // FCM,
        HttpClientService,
        HTTP,
        Vibration,
        // BackgroundGeolocation
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
